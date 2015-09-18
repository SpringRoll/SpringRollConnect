var router = require('express').Router(),
	async = require('async'),
	Release = require('../../models/release'),
	Group = require('../../models/group'),
	Game = require('../../models/game'),
	response = require('../../helpers/response');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin": "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/:slug', function(req, res)
{
	req.checkParams('slug').isSlug();
	req.checkQuery('token').optional().isToken();
	if (req.validationErrors())
	{
		return response.call(res, "Invalid arguments");
	}
	Release.getByGame(
		req.params.slug, 
		{
			token: req.query.token,
			debug: req.query.debug,
			archive: req.query.archive,
			multi: true
		}, 
		response.bind(res)
	);
});

router.get('/:slug/:status', function(req, res)
{
	req.checkParams('slug').isSlug();
	req.checkParams('status').isStatus();
	req.checkQuery('token').optional().isToken();
	if (req.validationErrors())
	{
		return response.call(res, "Invalid arguments");
	}
	Release.getByGame(
		req.params.slug, 
		{
			token: req.query.token,
			debug: req.query.debug,
			archive: req.query.archive,
			status: req.params.status,
			multi: true
		}, 
		response.bind(res)
	);
});

module.exports = router;
