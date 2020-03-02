var router = require('express').Router(),
	async = require('async'),
	User = require('../models/user'),
	sendmail = require('../helpers/sendmail');

router.get('/:token', function(req, res)
{
	User.getByToken(req.params.token, function(err, user) 
	{
		if (!user) 
		{
			req.flash('error', 'Password reset token is invalid or has expired.');
			return res.redirect('/forgot');
		}
		res.render('reset',
		{
			user: req.user,
			token: req.params.token
		});
	});
});

router.post('/:token', function(req, res) 
{
	async.waterfall([
		function(done) 
		{
			User.getByToken(req.params.token, function(err, user) 
			{
				if (!user) 
				{
					req.flash('error', 'Password reset token is invalid or has expired.');
					return res.redirect('back');
				}
				if (req.body.password != req.body.confirm)
				{
					req.flash('error', 'Password and confirm don\'t match');
					return res.redirect('/reset/' + req.params.token);
				}

				user.password = req.body.password;
				user.resetPasswordToken = undefined;
				user.resetPasswordExpires = undefined;
				user.save(done);
			});
		},
		function(user, num, done)
		{
			req.logIn(user, function(err)
			{
				done(err, user);
			});
		},
		function(user, done) 
		{
			var mailOptions = {
				to: user.email,
				from: process.env.SMTP_FROM_USER || 'passwordreset@demo.com',
				subject: 'Your password has been changed',
				text: 'Hello,\n\n' +
					'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
			};

			sendmail(mailOptions, function(err)
			{
				done(err);
			});
		}
	], 
	function(err) 
	{
		res.redirect('/');
	});
});

module.exports = router;
