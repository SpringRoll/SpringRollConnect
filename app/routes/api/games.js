var router = require('express').Router(),
	async = require('async'),
	Release = require('../../models/release'),
	Group = require('../../models/group'),
	Game = require('../../models/game'),
	cache = require('../../helpers/cache'),
	response = require('../../helpers/response');

router.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

router.get('/', cache, function(req, res)
{
	req.checkQuery('status').optional().isStatus();
	req.checkQuery('token').optional().isToken();

	if (req.validationErrors())
	{
		return response.call(res, "Invalid Arguments");
	}

	var status = req.query.status || 'prod';
	var token = req.query.token;
	var statuses = ['dev', 'qa', 'stage', 'prod'];

	// The status is inclusive of status levels greater than the current
	// for instance, QA status means the latest QA, Stage or Prod release
	statuses = statuses.slice(statuses.indexOf(status));

	var populateOptions = {
		path: 'releases',
		select: 'status updated commitId version debugCompressedSize debugUncompressedSize releaseCompressedSize releaseUncompressedSize',
		match: {'status': {$in: statuses}},
		options: {
			sort: {updated: -1},
			limit: 1
		}
	};

	async.waterfall([
		function(done)
		{
			// Require token
			if (status == "prod")
			{
				return Game.getAll(done)
					.select('-thumbnail')
					.populate(populateOptions);
			}
			else if (!token)
			{
				return done("No token");
			}
			Group.getByToken(token, function(err, group)
			{
				if (err)
				{
					return done(err);
				}
				else if (!group)
				{
					return done("Invalid token");
				}
				Game.getGamesByGroup(group, done)
					.select('-thumbnail')
					.populate(populateOptions);
			});
		}],
		function(err, games)
		{
			if (err)
			{
				return response.call(res, err);
			}
			else if (games.length === 0)
			{
				return response.call(res, "No games");
			}

			// Update the url
			games.forEach(function(game)
			{
				game.releases.forEach(function(release)
				{
					release.url = game.location + '/' +
						release.commitId + '/' +
						(req.query.debug == "true" ? 'debug' : 'release') +
						(req.query.archive == "true" ? '.zip' : '/index.html');
				});
			});

			response.call(res, err, games);
		}
	);
});

module.exports = router;
