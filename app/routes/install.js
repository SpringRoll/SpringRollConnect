var router = require('express').Router();
var fs = require('fs');
var bash = require('bash-vars');
var _ = require('lodash');
var access = require('../helpers/access');

router.get('*',  function(req, res, next)
{
	if (process.env.MONGO_DATABASE)
		return next();

	res.render('install', {
		port: process.env.PORT || 3000,
		admin: true
	});
});

router.post('*', function(req, res, next)
{
	if (process.env.MONGO_DATABASE)
		return next();
	
	req.checkBody('port', 'Port must be a valid number').isInt();
	req.checkBody('mongoDatabase', 'Database must be a valid URL end-point').notEmpty();
	req.checkBody('secretKey', 'Secret is required').notEmpty();
	req.checkBody('gmailUser', 'Gmail user must be a full email address').isEmail();
	req.checkBody('gmailPassword', 'Gmail password is required').notEmpty();
	req.checkBody('outputLog', 'Log file is required').notEmpty();
	req.checkBody('env', 'Deployment is required').notEmpty();

	if (req.body.admin)
	{
		req.checkBody('username', 'Account user name is required').notEmpty();
		req.checkBody('name', 'Account name is required').notEmpty();
		req.checkBody('email', 'Account email is required').isEmail();
		req.checkBody('password', 'Password is required and must match confirmation password')
			.notEmpty()
			.equals(req.body.confirm);
	}

	var errors = req.validationErrors();
	
	if (errors)
	{
		return res.render('install', { 
			errors: errors,
			admin: !!req.body.admin,
			port: process.env.PORT || 3000
		});
	}

	var env = {
		NODE_ENV: req.body.env,
		PORT: req.body.port,
		MONGO_DATABASE: req.body.mongoDatabase,
		SECRET_KEY: req.body.secretKey,
		GMAIL_USER: req.body.gmailUser,
		GMAIL_PASSWORD: req.body.gmailPassword,
		OUTPUT_LOG: req.body.outputLog
	};

	// Save the environmental variables this will
	// be later loaded by dotenv, but for not we'll
	// redirect back home
	fs.writeFileSync('../.env', bash.stringify(env));

	// Manually add the site envonmental variables
	_.extend(process.env, env);

	// Finish bootstrapping connection
	require('../helpers/database')(req.app);

	// Add the admin user
	if (req.body.admin)
	{
		var User = require('../models/user');

		User.createUser(
			{
				username: req.body.username,
				password: req.body.password,
				email: req.body.email,
				name: req.body.name
			}, 
			access.privilege.admin,
			function(err, user)
			{
				if (err) throw err;
				res.redirect('/');
			}
		);
	}
	else
	{
		res.redirect('/');
	}
});

module.exports = router;