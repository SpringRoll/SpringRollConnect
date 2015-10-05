var router = require('express').Router();

router.get('/:slug*', function(req, res)
{
	res.render('embed', 
	{
		isDebug: !!req.params['0']
	});
});

module.exports = router;