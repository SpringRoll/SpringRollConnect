var router = require('express').Router(),
    passport = require('passport');

router.get('/', function(req, res)
{
    res.render('register',
    {
        error: req.flash('error')
    });
});

router.post('/', function(req, res, next)
{
    // Do some basic validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('username', 'Username must only be alpha characters').isAlpha();
    req.checkBody('email', 'Email must be a valid email address').isEmail();

    var errors = req.validationErrors();

    if (errors)
    {
        return res.render('register',
        {
            errors: errors
        });
    }

	// Make sure that someone can override
	// the user default privilege, would be 
	// ugly to expose edit of this to anonymous
	// users to the site
	req.body.privilege = 0;
	next();
},
passport.authenticate('register',
{
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));

module.exports = router;