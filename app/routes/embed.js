var router = require('express').Router();

router.get('/:slug*', function(req, res)
{
	res.render('embed', 
	{
		isDebug: !!req.query.status ||
			!!req.query.version || 
			!!req.query.commitId
	});
});

module.exports = router;