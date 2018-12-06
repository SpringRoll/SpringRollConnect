var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Game = require('./game');
var Group = require('./group');
var async = require('async');

/**
 * The sub-doc Release model
 * @class Release
 * @extends mongoose.Schema
 */
var ReleaseSchema = new Schema(
  {
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
     * The Branch name
     * @property {string} branch
     */
    branch: {
      type: String,
      trim: false,
      required: false,
      unique: false
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
     * The user who updated the release
     * @property {User} updatedBy
     */
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },

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
      default: ''
    },

    /**
     * Size of the debug version compressed
     * @property {String} compressedSize
     */
    debugCompressedSize: {
      type: String,
      default: '0'
    },

    /**
     * Size of the debug version uncompressed
     * @property {String} compressedSize
     */
    debugUncompressedSize: {
      type: String,
      default: '0'
    },

    /**
     * Size of the game compressed
     * @property {String} compressedSize
     */
    releaseCompressedSize: {
      type: String,
      default: '0'
    },

    /**
     * Size of the game uncompressed
     * @property {String} compressedSize
     */
    releaseUncompressedSize: {
      type: String,
      default: '0'
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
      virtuals: true
    }
  }
);

ReleaseSchema.plugin(require('mongoose-unique-validator'));

/**
 * Get a release by id
 * @method getById
 * @static
 * @param {String|ObjectId} id
 * @param {function} callback
 * @return {Promise} Promise for async request
 */
ReleaseSchema.statics.getById = function(id, callback) {
  return this.findOne({ _id: id }, callback);
};

/**
 * Get a release by commit id
 * @method getByCommitId
 * @static
 * @param {String} commitId
 * @param {function} callback
 * @return {Promise} Promise for async request
 */
ReleaseSchema.statics.getByCommitId = function(commitId, callback) {
  return this.findOne({ commitId: commitId }, callback);
};

/**
 * Get a release by ids
 * @method getByIdsAndStatus
 * @static
 * @param {Array} ids
 * @param {function} callback
 * @return {Promise} Promise for async request
 */
ReleaseSchema.statics.getByIdsAndStatus = function(ids, status, callback) {
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
ReleaseSchema.statics.getByGame = function(slug, options, callback) {
  var Release = this;

  if (!callback) {
    callback = options;
    options = {};
  }

  // Set the defaults
  options = Object.assign(
    {
      multi: false,
      status: null,
      token: null,
      version: null,
      commitId: null,
      debug: false,
      archive: false
    },
    options
  );

  function addUrl(r) {
    r.url =
      r.game.location +
      '/' +
      r.commitId +
      '/' +
      (options.debug ? 'debug' : 'release') +
      (options.archive ? '.zip' : '/index.html');
  }

  async.waterfall(
    [
      function(done) {
        Game.getBySlugOrBundleId(slug, done).populate('groups.group');
      },
      function(game, done) {
        if (!game) return done('Invalid game slug');

        // commit version
        if (options.commitId) {
          done(null, game, { commitId: options.commitId }, true);
        }
        // specific version
        else if (options.version) {
          done(null, game, { version: options.version }, true);
        }
        // Get a specific status level
        else if (options.status) {
          var requiresToken = options.status != 'prod';
          var statuses = ['dev', 'qa', 'stage', 'prod'];

          // The status is inclusive of status levels greater than the current
          // for instance, QA status means the latest QA, Stage or Prod release
          statuses = statuses.slice(statuses.indexOf(options.status));

          done(null, game, { status: { $in: statuses } }, requiresToken);
        }
        // get all releases
        else {
          done(null, game, null, true);
        }
      },
      function(game, query, requiresToken, done) {
        if (requiresToken) {
          game.hasPermission(options.token, function(err, game) {
            if (err) return done(err);
            done(null, query, game);
          });
        } else {
          done(null, query, game);
        }
      },
      function(query, game, done) {
        query = !query
          ? { game: game._id }
          : { $and: [{ game: game._id }, query] };

        // Check for multi select
        var select = options.multi
          ? Release.find(query)
          : Release.findOne(query);

        // Make sure the the latest are always first
        select.sort('-created');

        select
          .select(
            'version url capabilities commitId game updated debugCompressedSize debugUncompressedSize releaseCompressedSize releaseUncompressedSize -_id'
          )
          .populate('game', 'slug location title -_id')
          .exec(done);
      }
    ],
    function(err, releases) {
      if (!err && releases) {
        if (Array.isArray(releases)) {
          releases.forEach(release => addUrl(release));
        } else {
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
ReleaseSchema.statics.removeById = function(id, callback) {
  this.remove({ _id: id }, function(err) {
    if (err) {
      callback(err);
    }
    Game.update(
      { releases: { $in: [id] } },
      { $pull: { releases: id } },
      callback
    );
  });
};

module.exports = mongoose.model('Release', ReleaseSchema);
