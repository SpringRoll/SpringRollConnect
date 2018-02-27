var mongoose = require('mongoose');
require('mongoose-type-email');

var Schema = mongoose.Schema;
var Email = mongoose.SchemaTypes.Email;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var _ = require('lodash');
var async = require('async');

/**
 * The user model
 * @class User
 * @extends mongoose.Schema
 */
var UserSchema = new Schema({
	
	/**
	 * The username
	 * @property {String} username
	 */
	username: {
		type: String,
		unique: true,
		lowercase: true,
		trim: true,
		required: true
	},
	/**
	 * The password hash
	 * @property {String} password
	 */
	password: {
		type: String,
		required: true
	},

	/**
	 * User's email address for notifications
	 * @property {String} email
	 */
	email: {
		type: Email,
		unique: true,
		required: true,
		lowercase: true
	},

	/**
	 * User's email address for notifications
	 * @property {Boolean} active
	 */
	active: {
		type:Boolean,
		default:true
	},

	/**
	 * The collection of favorites
	 * @property {Array} favorites
	 */
	groups: 
	[{
		type: Schema.Types.ObjectId,
		ref: 'Group'
	}],

	/**
	 * The user's full name
	 * @property {String} name
	 */
	name: {
		type: String,
		trim: true,
		required: true
	},

	/**
	 * A random string of characters for resetting password
	 * @property {String} resetPasswordToken
	 */
	resetPasswordToken: String,

	/**
	 * The date when the reset token expires
	 * @property {Date} resetPasswordExpires
	 */
	resetPasswordExpires: Date
});

UserSchema.plugin(require('mongoose-unique-validator'));
UserSchema.plugin(require('mongoose-deep-populate'));

/**
 * The global user privilege
 * @property {int} privilege
 */
UserSchema.virtual('privilege').get(function()
{
	if (this.groups)
	{
		var group = _.max(this.groups, 'privilege');
		if (group)
		{
			return group.privilege;
		}
	}
	return 0;
});

/**
 * Remove the user from a group
 * @method removeGroup
 * @static
 * @param {null|String|Array|ObjectId} ids The collection of user ids, is null, removes all
 * @param {ObjectId} groupId The group id
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.statics.removeGroup = function(ids, groupId, callback)
{
	var query = {};
	if (ids)
	{
		if (!Array.isArray(ids)) ids = [ids];
		query = { _id: { $in: ids }};
	}
	return this.update(
		query,
		{ $pull: { groups : groupId }},
		{ multi: true }
	).exec(callback);
};

/**
 * Add the user to a group
 * @method addGroup
 * @static
 * @param {String|Array|ObjectId} ids The collection of user ids
 * @param {ObjectId} groupId The group id
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.statics.addGroup = function(ids, groupId, callback)
{
	if (!Array.isArray(ids)) ids = [ids];
	return this.update(
		{ _id: { $in: ids }},
		{ $push: { groups: groupId }},
		{ multi: true }
	).exec(callback);
};

/**
 * Add the user to a group
 * @method getByGroup
 * @static
 * @param {Group} group The group
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.statics.getByGroup = function(group, callback)
{
	return this.find({ groups: group.id }, callback).sort('name');
};

/**
 * Get a user by email address
 * @method getByEmail
 * @static
 * @param {ObjectId} email The user email
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.statics.getByEmail = function(email, callback)
{
	return this.findOne({ email: email }, callback);
};

/**
 * Get the games for a user
 * @method getGames
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.methods.getGames = function(callback)
{
	return this.model('Game').getGamesByGroups(
		this.groups,
		callback
	);
};

/**
 * See if a user is in a group
 * @method inGroup
 * @param {Group} group The group to check against
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.methods.inGroup = function(group)
{
	return _.find(this.groups, function(g){
		return g._id.equals(group._id);
	});
};

/**
 * Get all the users mine the current one
 * @method getAll
 * @static
 * @param {ObjectId} excludeId The user to exclude from the list
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.statics.getAll = function(excludeId, callback)
{
	return this.find({_id: {$ne: excludeId}}, callback)
		.sort('name');
};

/**
 * Get a user by reset token
 * @method getByToken
 * @static
 * @param {string} token The random token to search on
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.statics.getByToken = function(token, callback)
{
	return this.findOne({ 
		resetPasswordToken: token,
		resetPasswordExpires: { $gt: Date.now() } 
	}, callback).populate('groups');
};

/**
 * Generate a new token
 * @method generateToken
 * @param {function} callback The callback with result
 */
UserSchema.statics.generateToken = function(callback)
{
	crypto.randomBytes(20, function(err, buffer)
	{
		callback(err, buffer.toString('hex'));
	});
};

/**
 * Get a user by username
 * @method getByUsername
 * @static
 * @param {string} username The username
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.statics.getByUsername = function(username, callback)
{
	return this.findOne({ 
		username: username
	}, callback).populate('groups');
};

/**
 * Get a user by user id
 * @method getById
 * @static
 * @param {string} token The random token to search on
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.statics.getById = function(id, callback)
{
	return this.findById(id, callback).populate('groups');
};

/**
 * Get users by search
 * @method getBySearch
 * @static
 * @param {string} search The random token to search on
 * @param {int} limit The number of results
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.statics.getBySearch = function(search, limit, callback)
{
	return this.find({ name: new RegExp(search, "i") })
		.limit(limit)
		.sort('name')
		.select('name')
		.exec(callback);
};

// Hash the password after every save of the user
UserSchema.pre('save', function(next)
{
	if (this.isModified('password'))
	{
		this.password = bcrypt.hashSync(
			this.password, 
			bcrypt.genSaltSync(10), 
			null
		);
	}
	return next();
});

/**
 * Get all the users mine the current one
 * @method createUser
 * @static
 * @param {object} data The user data object
 * @param {function|int} [privilege=0] The global user privilege
 * @param {function} callback The callback with result
 */
UserSchema.statics.createUser = function(data, privilege, callback)
{
	var Group = this.model('Group');
	var User = this;

	if (_.isFunction(privilege))
	{
		callback = privilege;
		privilege = 0;
	}

	// Editors and Admin get tokens that don't expire
	var tokenExpires = !privilege ? Group.getTokenExpires() : null;

	async.waterfall([
		function(done)
		{
			Group.generateToken(done);
		},
		function(token, done)
		{
			var group = new Group({
				name: data.name,
				slug: data.username,
				token: token,
				tokenExpires: tokenExpires,
				privilege: parseInt(privilege || 0),
				isUserGroup: true
			});
			group.save(function(err)
			{
				done(err, group);
			});
		},
		function(group, done)
		{
			var user = new User({
				username: data.username,
				password: data.password,
				email: data.email,
				name: data.name,
				groups: [group._id]
			});
			user.save(callback);
		}
	]);
};

/**
 * Add the new user
 * @method addUser
 * @static
 * @param {object} data The user data object
 * @param {function} callback The callback with result
 */
UserSchema.statics.addUser = function(data, callback)
{
	var User = this;

	// find a user in Mongo with provided username
	this.getByUsername(data.username, function(err, user)
	{
		// In case of any error return
		if (err)
		{
			return callback(err);
		}
		// already exists
		if (user)
		{
			return callback('User Already Exists');
		}
		else if (data.confirm != data.password)
		{
			return callback('Password and confirm password do not match');
		}
		else
		{
			User.createUser(
				{
					username: data.username,
					password: data.password,
					email: data.email,
					name: data.name
				},
				data.privilege,
				function(err, user)
				{
					if (err)
					{
						callback('Unable to add Account');
						throw err;
					}
					callback(null, user);
				}
			);
		}
	});
};

/**
 * Compare the password with the current user
 * @method comparePassword
 * @param {string} candidatePassword The password to check (plain, not hash)
 * @param {function} callback The callback with result
 * @return {Promise} The promise object for async action
 */
UserSchema.methods.comparePassword = function(candidatePassword, callback)
{
	return bcrypt.compareSync(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);