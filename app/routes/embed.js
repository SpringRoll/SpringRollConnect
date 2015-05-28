var router = require('express').Router();

router.get('/:slug*', function(req, res)
{
	res.render('embed');
});

module.exports = router;