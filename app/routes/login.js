var router = require('express').Router(),
	passport = require('passport');

router.post('/', passport.authenticate('login',
	{
		failureRedirect: '/login',
		failureFlash: true
	}), 
	function(req, res)
	{
		res.redirect(req.body.redirect || '/');
	}
);

router.get('/', function(req, res)
{
	res.render('login',
	{
		error: req.flash('error'),
		redirect: req.flash('redirect')
	});
});

module.exports = router;