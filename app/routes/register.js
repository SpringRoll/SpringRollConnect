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