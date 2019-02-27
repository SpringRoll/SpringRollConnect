var Group = require('../models/group');
var User = require('../models/user');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var async = require('async');
var log = require('./logger');

module.exports = function(passport)
{
	// Passport also needs to serialize and deserialize 
	// user instance from a session store in order to 
	// support login sessions, so that every subsequent 
	// request will not contain the user credentials. 
	// It provides two method: 
	passport.serializeUser(function(user, done){
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done){
		User.getById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done)
		{ 
			// check in mongo if a user with username exists or not
			User.getByUsername(username, function(err, user)
			{
				// In case of any error, return using the done method
				if (err) return done(err);

				if (!user)
				{
					err = 'User Not Found';                 
				}
				else if (!user.active)
				{
					err = 'Deactivated Account';
				}
				else if (!user.comparePassword(password))
				{
					err = 'Invalid Password';
				}

				// Check for error
				if (err)
				{
					return done(null, false, req.flash('error', err));
				}

				// User and password both match, return user from 
				// done method which will be treated like success
				return done(null, user);
			});
		})
	);

	// Handle the signup process
	passport.use('register', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done)
		{
			// Delay the execution of addUser and execute 
			// the method in the next tick of the event loop
			process.nextTick(function()
			{
				User.addUser(
					{
						username: username,
						password: password,
						email: req.body.email,
						name: req.body.name,
						confirm: req.body.confirm,
						privilege: req.body.privilege
					},
					function(err, user)
					{
						if (err)
						{
              log.error(err);
							return done(null, false, req.flash('error', err));
						}
						done(null, user);
					}
				);
			});
		})
	);
};
