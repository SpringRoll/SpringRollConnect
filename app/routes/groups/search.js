var router = require('express').Router();
var Group = require('../../models/group');

router.post('/', function(req, res)
{
	if (req.body.slug)
	{
		res.send(Group.getBySlug(
			req.body.slug,
			req.body.isUserGroup || null
		).select('slug'));
	}
	else if (req.body.search)
	{
		res.send(Group.getBySearch(req.body.search, 10));
	}
});

module.exports = router;