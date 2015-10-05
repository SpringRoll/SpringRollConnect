var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var _ = require('lodash');

/**
 * The Config model
 * @class Config
 * @extends mongoose.Schema
 */
var ConfigSchema = new Schema({
	
	/**
	 * The expiration in days of dev releases
	 * @property {Number} devExpireDays
	 */
	devExpireDays: {
		type: Number,
		default: 90,
		required: true
	},

	/**
	 * The maximum number of dev releases to keep
	 * @property {Number} maxDevReleases
	 */
	maxDevReleases: {
		type: Number,
		default: 20,
		required: true
	},
	
	/**
	 * The embed JavaScript URL
	 * @property {String} embedScriptPlugin
	 */
	embedScriptPlugin: {
		type: String,
		trim: true
	},

	/**
	 * The embed css URL
	 * @property {String} embedCssPlugin
	 */
	embedCssPlugin: {
		type: String,
		trim: true
	},

	/**
	 * The embed JavaScript URL for non-production
	 * @property {String} embedDebugScriptPlugin
	 */
	embedDebugScriptPlugin: {
		type: String,
		trim: true
	},

	/**
	 * The embed css URL for non-production
	 * @property {String} embedDebugCssPlugin
	 */
	embedDebugCssPlugin: {
		type: String,
		trim: true
	}
});

/**
 * Get a config
 * @method getConfig
 * @param {function} callback The callback
 * @return {Promise} The async Promise
 */
ConfigSchema.statics.getConfig = function(callback)
{
	return this.findOne({}, callback);
};

module.exports = mongoose.model('Config', ConfigSchema);