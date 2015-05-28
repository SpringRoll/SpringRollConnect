var router = require('express').Router();

router.get('/', function(req, res)
{
	res.render('docs');
});

module.exports = router;