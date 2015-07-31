var router = require('express').Router(),
	async = require('async'),
	Game = require('../../models/game'),
	Group = require('../../models/group'),
	Release = require('../../models/release'),
	response = require('../../helpers/response'),
	_ = require('lodash'),
    log = require('../../helpers/logger');

router.post('/:slug', function(req, res)
{
	req.checkBody('status', 'Status must be one of: "dev", "qa", "stage", "prod"').isStatus();
	req.checkBody('commitId', 'Commit ID must be a valid Git commit has').isCommit();
	req.checkBody('token', 'Token is required').isToken();
	
	if (req.body.verison)
		req.checkBody('version', 'Not a properly formatted Semantic Version').isSemver();

	var errors = req.validationErrors();

	if (errors)
	{
		if (req.body.redirect)
		{
			req.flash('errors', errors);
			res.redirect(req.body.redirect);
		}
		else
		{
			log.error("Validation error adding release");
			log.error(errors);

			res.send({
				success:false,
				data: errors
			});
		}
		return;
	}

	async.waterfall([
		function(done)
		{
			Game.getBySlug(req.params.slug, done).select('-thumbnail');
		},
		function(game, done)
		{
			game.hasPermission(req.body.token, done);
		},
		function(game, done)
		{
			var values = _.clone(req.body);
			values.game = game._id;
			delete values.token;
			values.created = values.updated = Date.now();

			// If the capabilities aren't set, inherit the
			// default game capabilities
			if (!values.capabilities)
			{
				values.capabilities = game.capabilities.toObject();
			}
			// Or else update the game defaults
			else
			{
				_.assign(
					game.capabilities, 
					_.cloneDeep(values.capabilities)
				);
				game.save();
			}
			var release = new Release(values);
			release.save(function(err, release)
			{
				done(err, game, release);
			});
		},
		function(game, release, done)
		{
			game.releases.push(release._id);
			game.updated = Date.now();
			game.save(function(err, result)
			{
				done(err, game);
			});
		}, 
		function(game, done)
		{
			Release.getByIdsAndStatus(game.releases, "dev", function(err, releases)
			{
				if (releases.length > MAX_DEV_RELEASES)
				{
					_.each(_.dropRight(releases, MAX_DEV_RELEASES), function(release)
					{
						Release.removeById(release._id, function(){});
					});
				}
				done(null, game);
			});
		}
	], 
	function(err, result)
	{
		if (err)
		{			
			if (req.body.redirect)
			{
				req.flash('error', 'Unable to add the release: ' + err);
				res.redirect(req.body.redirect);
			}
			else
			{
				log.error('Unable to add the release');
				log.error(err);

				res.status(500).send({
					success:false,
					data: 'Unable to add the release'
				});
			}
			return;
		}

		if (req.body.redirect)
		{
			req.flash('success', 'Release added successfully');
			res.redirect(req.body.redirect);
		}
		else
		{
			res.send({
				success: true, 
				data: result
			});
		}
	});
});

router.get('/:slug/:status?', function(req, res)
{
	req.checkParams('slug').isSlug();
	req.checkParams('status').optional().isStatus();
	req.checkQuery('token').optional().isToken();
	if (req.validationErrors())
	{
		return response.call(res, "Invalid arguments");
	}
	Release.getByGame(
		req.params.slug, 
		{
			status: req.params.status || 'prod',
			debug: req.query.debug,
			archive: req.query.archive,
			token: req.query.token
		}, 
		response.bind(res)
	);
});

router.get('/:slug/commit/:commitId', function(req, res)
{
	req.checkParams('slug').isSlug();
	req.checkParams('commitId').isCommit();
	req.checkQuery('token').isToken();
	if (req.validationErrors())
	{
		return response.call(res, "Invalid arguments");
	}
	Release.getByGame(
		req.params.slug, 
		{
			commitId: req.params.commitId,
			debug: req.query.debug,
			archive: req.query.archive,
			token: req.query.token
		}, 
		response.bind(res)
	);
});

router.get('/:slug/version/:version', function(req, res)
{
	req.checkParams('slug').isSlug();
	req.checkParams('version').isSemver();
	req.checkQuery('token').isToken();
	if (req.validationErrors())
	{
		return response.call(res, "Invalid arguments");
	}
	Release.getByGame(
		req.params.slug, 
		{
			version: req.params.version,
			token: req.query.token,
			debug: req.query.debug,
			archive: req.query.archive
		}, 
		response.bind(res)
	);
});

module.exports = router;