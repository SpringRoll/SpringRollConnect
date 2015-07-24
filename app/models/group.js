var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');
var crypto = require('crypto');

/**
 * The Group model
 * @class Group
 * @extends mongoose.Schema
 */
var GroupSchema = new Schema({
	
	/**
	 * The username
	 * @property {String} username
	 */
	name: {
		type: String,
		trim: true,
		required: true
	},

	/**
	 * If the group represents a single user
	 * @property {Boolean} isUserGroup
	 */
	isUserGroup: Boolean,

	/**
	 * For non-userGroups, the URI slug
	 * @property {String} slug
	 */
	slug: {
		type: String,
		trim: true,
		lowercase: true,
		unique: true,
		required: true
	},

	/**
	 * The access token for games
	 * @property {String} token
	 */
	token: {
		type: String,
		unique: true,
		trim: true,
		required: true
	},

	/**
	 * The access token for games
	 * @property {Date} tokenExpires
	 */
	tokenExpires: Date,

	/**
	 * Global privilege, 0 is subscriber, 1 is admin, 2 is root
	 * @property {Number} privilege
	 * @default 0
	 */
	privilege: {
		type: Number,
		default: 0,
		required: true,
		min: 0,
		max: 2
	},

	/**
	 * The logo image
	 * @property {Buffer} logo
	 */
	logo: {
		type: Buffer,
		required: false
	}
});

GroupSchema.plugin(require('mongoose-unique-validator'));

// Convert the base64 image into a Buffer
GroupSchema.pre('save', function(next)
{
	if (this.isModified('logo'))
	{
		this.logo = new Buffer(this.logo, "base64");
	}
	return next();
});

/**
 * Generate a new token
 * @method generateToken
 * @param {function} callback The callback with result
 */
GroupSchema.statics.generateToken = function(callback)
{
	crypto.randomBytes(20, function(err, buffer)
	{
		callback(err, buffer.toString('hex'));
	});
};

/**
 * Generate a new token
 * @method generateToken
 * @param {function} callback The callback with result
 */
GroupSchema.methods.refreshToken = function(callback)
{
	var group = this;
	var Group = this.model('Group');
	Group.generateToken(function(err, token)
	{
		group.token = token;
		
		if (group.tokenExpires)
		{
			group.tokenExpires = Group.getTokenExpires();
		}
		group.save(callback);
	});
};

/**
 * Get the user groups, a group which represents a single user
 * @method getUserGroups
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
GroupSchema.statics.getUserGroups = function(callback)
{
	return this.find({isUserGroup: true})
		.sort('name')
		.exec(callback);
};

/**
 * Get the non-user groups, aka "teams"
 * @method getTeams
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
GroupSchema.statics.getTeams = function(callback)
{
	return this.find({isUserGroup: false})
		.sort('name')
		.exec(callback);
};

/**
 * Update the token
 * @method setToken
 * @param {string} token The random token to search on
 * @param {Date} date The
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
GroupSchema.methods.saveToken = function(token, forever, callback)
{
	this.token = token;
	this.tokenExpires = forever ? -1 : this.model('Group').getTokenExpires();

	return this.save(callback);
};

/**
 * Get a group by group id
 * @method getById
 * @static
 * @param {ObjectID|String} id The group id
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
GroupSchema.statics.getById = function(id, callback)
{
	return this.findOne({ _id: id }, callback);
};

/**
 * Get a user by reset token
 * @method getByToken
 * @static
 * @param {string} token The random token to search on
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
GroupSchema.statics.getByToken = function(token, callback)
{
	return this.findOne({
		$and : [
			{ token : token },
			{ $or : [
				{ tokenExpires: { $gt: Date.now() } },
				{ tokenExpires: null }
			]}
		]
	}, callback);
};

/**
 * Get the default token expiration date
 * @method getTokenExpires
 * @static
 * @return {int} The milliseconds of the expiration (1 year)
 */
GroupSchema.statics.getTokenExpires = function()
{
	return Date.now() + 3600000 * 24 * 365;
};

/**
 * Get group by URI slug
 * @method getBySlug
 * @static
 * @param {string} slug The URI slug
 * @param {Function|Boolean|null} [isUserGroup=null] Null gets both user and teams
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
GroupSchema.statics.getBySlug = function(slug, isUserGroup, callback)
{
	var query = { slug: slug };
	if (_.isFunction(isUserGroup))
	{
		callback = isUserGroup;
		isUserGroup = null;
	}
	if (_.isBoolean(isUserGroup))
	{
		query.isUserGroup = isUserGroup;
	}
	return this.findOne(query, callback);
};

/**
 * Get groups by search
 * @method getBySearch
 * @static
 * @param {string} search The random token to search on
 * @param {int} limit The number of results
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
GroupSchema.statics.getBySearch = function(search, limit, callback)
{
	return this.find({ name: new RegExp(search, "i") })
		.limit(limit)
		.sort('name')
		.select('name')
		.exec(callback);
};

module.exports = mongoose.model('Group', GroupSchema);