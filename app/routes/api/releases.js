var router = require('express').Router(),
	async = require('async'),
	_ = require('lodash'),
	Release = require('../../models/release'),
	Group = require('../../models/group'),
	Game = require('../../models/game'),
	response = require('../../helpers/response');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.post('/clean', function(req, res)
{
	var devExpireDays = CONFIGURATION.devExpireDays;
	var moment = require('moment');
	var expiration = moment()
		.subtract(devExpireDays, 'days')
		.toDate();

	Release.find({'created': {'$lt': expiration }})
		.select('commitId game')
		.populate('game', 'slug')
		.exec(function(err, releases)
		{
			if (releases && releases.length)
			{
				Release.removeById(_.pluck(releases, '_id'), function()
				{
					res.send(releases);
				});
			}
			else
			{
				res.send(releases);
			}
		}
	);
});

router.get('/:slugOrBundleId', function(req, res)
{
	req.checkQuery('status').optional().isStatus();
	req.checkQuery('token').optional().isToken();
	req.checkQuery('version').optional().isSemver();
	req.checkQuery('commitId').optional().isCommit();
	if (req.validationErrors())
	{
		return response.call(res, "Invalid arguments");
	}
	Release.getByGame(
		req.params.slugOrBundleId,
		{
			version: req.query.version,
			commitId: req.query.commitId,
			archive: req.query.archive,
			status: req.query.status,
			token: req.query.token,
			debug: req.query.debug,
			multi: true
		}, 
		response.bind(res)
	);
});

module.exports = router;