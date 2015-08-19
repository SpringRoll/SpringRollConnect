var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Game = require('./game');
var Group = require('./group');
var async = require('async');
var _ = require('lodash');

/**
 * The sub-doc Release model
 * @class Release
 * @extends mongoose.Schema
 */
var ReleaseSchema = new Schema({

	/**
	 * Reference to the game
	 * @property {Game} game
	 */
	game: {
		type: Schema.Types.ObjectId,
		ref: 'Game'
	},

	/**
	 * The optional version
	 * @property {string} version
	 */
	version: {
		type: String,
		lowercase: true,
		trim: true
	},

	/**
	 * The current status
	 * @property {string} status
	 */
	status: {
		type: String,
		enum: ['dev', 'qa', 'stage', 'prod'],
		required: true
	},

	/**
	 * The GIT commmit id hash
	 * @property {string} commitId
	 */
	commitId: {
		type: String,
		trim: true,
		required: true,
		unique: true
	},

	/**
	 * When the game was created
	 * @property {Date} created
	 */
	created: Date,

	/**
	 * When the game was updated
	 * @property {Date} updated
	 */
	updated: Date,

	/**
	 * Release notes for the game
	 * @property {String} notes
	 */
	notes: {
		type: String,
		trim: true
	},

	/**
	 * The URL, not actually set
	 * @property {String} url
	 */
	url: {
		type: String,
		default: ""
	},

	/**
	 * Definition of what features, sizes and ui
	 * are supported by this release.
	 * @property {Object} capabilities
	 */
	capabilities: require('./capabilities')
},
{
	toJSON: {
		virtuals : true
	}
});

ReleaseSchema.plugin(require('mongoose-unique-validator'));

/**
 * Get a release by id
 * @method getById
 * @static
 * @param {String|ObjectId} id
 * @param {function} callback
 * @return {Promise} Promise for async request
 */
ReleaseSchema.statics.getById = function(id, callback)
{
	return this.findOne({_id: id}, callback);
};

/**
 * Get a release by ids
 * @method getByIdsAndStatus
 * @static
 * @param {Array} ids
 * @param {function} callback
 * @return {Promise} Promise for async request
 */
ReleaseSchema.statics.getByIdsAndStatus = function(ids, status, callback)
{
	return this.find(
		{
			_id: { $in: ids }, 
			status: status
		}, 
		callback
	);
};

/**
 * Get all releases by game and status
 * @method getByGame
 * @static
 * @param {string} slug The game slug
 * @param {Object|Function} [options] The selection options
 * @param {String} [options.status] The status
 * @param {String} [options.token] The token for accessing non-prod releases
 * @param {String} [options.version] The current version
 * @param {String} [options.commitId] The git commit hash
 * @param {Boolean} [options.multi=false] If we s 
 * @param {function} callback
 * @return {Promise} Promise for async request
 */
ReleaseSchema.statics.getByGame = function(slug, options, callback)
{
	var Release = this;

	if (!callback)
	{
		callback = options;
		options = {};
	}

	// Set the defaults
	options = _.extend({ 
		multi: false,
		status: null,
		token: null,
		version: null,
		commitId: null,
		debug: false,
		archive: false
	}, options);

	function addUrl(r)
	{
		r.url = r.game.location + '/' + 
			r.commitId + '/' +
			(options.debug ? 'debug' : 'release') +
			(options.archive ? '.zip' : '/index.html');
	}
	
	async.waterfall([
		function(done)
		{
			Game.getBySlug(slug, done).populate('groups.group');
		},
		function(game, done)
		{
			if (!game) return done('Invalid game slug');

			// Get a specific status level
			if (options.status)
			{
				var requiresToken = options.status != 'prod';
				done(null, game, { status: options.status }, requiresToken);
			}
			// commit version
			else if (options.commitId)
			{
				done(null, game, { commitId: options.commitId }, true);
			}
			// specific version
			else if (options.version)
			{
				done(null, game, { version: options.version }, true);
			}
			// get all releases
			else 
			{
				done(null, game, null, true);
			}
		}, 
		function(game, query, requiresToken, done)
		{
			if (requiresToken)
			{
				game.hasPermission(options.token, function(err, game)
				{
					if (err) return done(err);
					done(null, query, game);
				});
			}
			else
			{
				done(null, query, game);
			}
		},
		function(query, game, done)
		{
			query = !query ? { game: game._id } : { $and: [{ game: game._id }, query ]};

			// Check for multi select
			var select = options.multi ? Release.find(query) : Release.findOne(query);

			// Make sure the the latest are always first
			select.sort('-created');

			select
				.select('version url capabilities commitId game -_id')
				.populate('game', 'slug location title -_id')
				.exec(done);
		}],
		function(err, releases)
		{
			if (!err && releases)
			{
				if (Array.isArray(releases))
				{
					_.each(releases, addUrl);
				}
				else
				{
					addUrl(releases);
				}
			}
			callback(err, releases);
		}
	);
};

/**
 * Delete release by id
 * @method removeById
 * @static
 * @param {string} slug
 * @param {function} callback
 * @return {Promise} Promise for async request
 */
ReleaseSchema.statics.removeById = function(id, callback)
{
	this.remove({ _id: id }, function(err)
	{
		if (err)
		{
			callback(err);
		}
		Game.update(
			{ releases : { $in : [id] } }, 
			{ $pull: { releases : id }}, 
			callback
		);
	});
};

module.exports = mongoose.model('Release', ReleaseSchema);