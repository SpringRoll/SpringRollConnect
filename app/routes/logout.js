var router = require('express').Router();

router.get('/', function(req, res)
{
    req.logout();
    res.redirect('/');
});

module.exports = router;