var router = require('express').Router();
var User = require('../models/user');
var crypto = require('crypto');
var async = require('async');
var sendmail = require('../helpers/sendmail');

router.post('/', function(req, res, next)
{
	async.waterfall([
		function(done)
		{
			User.generateToken(done);
		},
		function(token, done)
		{
			User.getByEmail(req.body.email, function(err, user)
			{
				if (!user)
				{
					req.flash('error', 'No account with that email address exists.');
					return res.redirect('/forgot');
				}

				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

				user.save(function(err)
				{
					done(err, token, user);
				});
			});
		},
		function(token, user, done)
		{
			var mailOptions = {
				to: user.email,
				from: 'passwordreset@demo.com',
				subject: 'Node.js Password Reset',
				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
					'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
					'http://' + req.headers.host + '/reset/' + token + '\n\n' +
					'If you did not request this, please ignore this email and your password will remain unchanged.\n'
			};

			sendmail(mailOptions, function(err)
			{
				req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
				done(err);
			});
		}
	],
	function(err)
	{
		if (err) return next(err);
		res.redirect('/forgot');
	});
});

router.get('/', function(req, res)
{
	res.render('forgot', {
		error: req.flash('error'),
		success: req.flash('success')
	});
});

module.exports = router;