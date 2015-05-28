var router = require('express').Router(),
	User = require('../../models/user'),
	passport = require('passport');

router.post('/', function(req, res)
{
	var pass = req.body.password;

	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'Username must only be alpha characters').isAlpha();
	req.checkBody('email', 'Email must be a valid email address').isEmail();
	req.checkBody('privilege', 'Privilege must be valid').isInt();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('confirm', 'Confirm is required').notEmpty();

	var errors = req.validationErrors();

	if (errors)
	{
		req.flash('errors', errors);
		return res.redirect('/users/add');
	}

	User.addUser(req.body, function(err, user)
	{
		if (err)
		{
			req.flash('error', err);
		}
		else
		{
			req.flash('success', req.body.name + ' has been added successfully');
		}
		res.redirect('/users/add');
	});	
});

router.get('/', function(req, res)
{
	res.render('users/add',
	{
		error: req.flash('error'),
		errors: req.flash('errors'),
		success: req.flash('success')
	});
});

module.exports = router;