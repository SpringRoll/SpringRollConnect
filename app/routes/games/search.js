var router = require('express').Router();
var Game = require('../../models/game');

router.post('/', function(req, res)
{
	if (req.body.slug)
	{
		res.send(Game.getBySlug(req.body.slug).select('slug'));
	}
	else if (req.body.bundleId)
	{
		res.send(Game.getByBundleId(req.body.bundleId).select('slug'));
	}
	else if (req.body.search)
	{
		res.send(Game.getBySearch(req.body.search, 10));
	}
});

module.exports = router;