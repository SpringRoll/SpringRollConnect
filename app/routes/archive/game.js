var router = require('express').Router(),
	async = require('async'),
	_ = require('lodash'),
	privileges = require('../../helpers/access').privilege,
	Game = require('../../models/game-archive'),
	GameRestore = require('../../models/game'),
	User = require('../../models/user'),
	Release = require('../../models/release'),
  log = require('../../helpers/logger');

/**
 * Abstraction to handle the page errors
 * @param  {String|Array} errors Single or collection of errors
 */
function handleError(req, res, errors)
{
	log.error(errors);
	if (Array.isArray(errors))
	{
		req.flash('errors', errors);
	}
	else
	{
		req.flash('error', 'Unable to update the game: ' + errors);
	}
	res.redirect(req.originalUrl);
}

/**
 * Abstraction to render a page, takes care of all
 * of the access control and populate the page with
 * standard parameters
 * @param  {Object} req The express request object
 * @param {Object} res The express response object
 * @param {string} template The template to use
 * @param {String} [populate='groups.group'] The game fields to populate
 * @param {function} [success] Callback when completed
 */
function renderPage(req, res, template, populate, success)
{
	populate = ['groups.group'].concat(populate || []);
	async.waterfall(
		[
			function(done)
			{
				Game.getBySlug(req.params.slug, done)
					.populate(populate);
			},
			function(game, done)
			{
				if (populate.indexOf('releases'))
				{
					User.populate(game.releases, {
						path: 'updatedBy',
						select: 'name'
					},
					function(err, releases)
					{
						if (err) return done(err);
						done(null, game);
					});
				}
				else
				{
					done(null, game);
				}
			},
			function(game, done)
			{
				if (!game) return res.status(404).render('404');

				game.getAccess(req.user, done);
			}
		],
		function(err, game, access)
		{
			if (err)
			{
				return res.status(401).render('401');
			}
			if (success) success(game);

			res.render(template, {
				game: game,
				capabilities: game.capabilities,
				host: req.headers.host,
				isEditor: access.permission > 0,
				isAdmin: access.permission > 1,
				token: access.token,
				errors: req.flash('errors'),
				success: req.flash('success'),
				error: req.flash('error')
			});
		}
	);
}

/**
 * Abstraction to post a page, takes care of all
 * of the access control and populate the page with
 * standard parameters.
 * @param  {Object} req The express request object
 * @param {Object} res The express response object
 * @param {string} minPrivilege The minimum privilege needed to run all form
 * @param {Object} actions Run custom page actions
 */
function postPage(req, res, minPrivilege, actions)
{
	async.waterfall(
		[
			function(done)
			{
				Game.getBySlug(req.params.slug, done).populate('groups.group');
			},
			function(game, done)
			{
				if (!game) return res.status(404).render('404');

				game.getAccess(req.user, done);
			},
			function(game, access, done)
			{
				var response = function(err)
				{
					if (err) return done(err);
					done(null, game);
				};

				if (access.permission < minPrivilege)
				{
					return done('Invalid form permissions');
				}

				if (!req.body.action || !actions[req.body.action])
				{
					done('Invalid form action');
				}
				actions[req.body.action](response, game, access);
			}
		],
		function(err, game)
		{
			if (err) return handleError(req, res, err);

			req.flash('success', game.title + " updated successfully");
			res.redirect(req.originalUrl);
		}
	);
}

function defaultCapabilities(capabilities)
{
	capabilities.ui = _.assign({
			mouse: false,
			touch: false
		}, capabilities.ui);

	capabilities.sizes = _.assign({
			xsmall: false,
			small: false,
			medium: false,
			large: false,
			xlarge: false
		}, capabilities.sizes);
}

// Generic reponse handler, must bind to game instance
function response(err)
{
	if (err) return done(err);
	done(null, this);
}

router.post('/:slug/releases', function(req, res)
{
	postPage(req, res, privileges.editor,
	{
		removeRelease: function(done)
		{
			Release.removeById(
				req.body.release,
				done
			);
		},
		statusChange: function(done)
		{
			Release.findByIdAndUpdate(
				req.body.release,
				{
					status: req.body.status,
					updated: Date.now(),
					updatedBy: req.body.updatedBy
				},
				done
			);
		}
	});
});

router.post('/:slug/privileges', function(req, res)
{
	postPage(req, res, privileges.admin,
	{
		removeGroup: function(done, game)
		{
			game.removeGroup(
				req.body.group,
				done
			);
		},
		addGroup: function(done, game)
		{
			game.addGroup(
				req.body.group,
				req.body.permission,
				done
			);
		},
		changePermission: function(done, game)
		{
			game.changePermission(
				req.body.group,
				req.body.permission,
				done
			);
		}
	});
});

router.post('/:slug/release', function(req, res)
{
	postPage(req, res, privileges.editor,
	{
		selectRelease: function(done, game, access)
		{
			Release.getById(req.body.release, function(err, release)
			{
				if (err) return done(err);

				res.render("archive/release", {
					game: game,
					release: release,
					capabilities: release.capabilities,
					host: req.headers.host,
					isEditor: access.permission > 0,
					isAdmin: access.permission > 1,
					token: access.token,
					errors: req.flash('errors'),
					success: req.flash('success'),
					error: req.flash('error')
				});
			});
		},
		removeRelease: function(done, game)
		{
			Release.removeById(req.body.release, function(err)
			{
				if (err) return done(err);
				req.flash('success', 'Deleted release');
				res.redirect('/archive/game/' + game.slug + '/releases');
			});
		},
		updateRelease: function(done, game)
		{
			req.checkBody('commitId', 'Commit is a Git hash').isCommit();
			req.checkBody('status', 'Status must be a valid status').isStatus();
			req.checkBody('notes').optional();

			if (req.body.version)
				req.checkBody('version', 'Version must be a valid semantic version').isSemver();

			defaultCapabilities(req.body.capabilities);

			var errors = req.validationErrors();

			if (errors) return done(errors);

			req.body.updated = Date.now();
			Release.findByIdAndUpdate(req.body.release, req.body, done);
		}
	});
});

router.post('/:slug', function(req, res)
{
	postPage(req, res, privileges.editor,
	{
		updateGame: function(done, game)
		{
			req.checkBody('title', 'Title is required').notEmpty();
			req.checkBody('bundleId', 'Bundle ID is required').isBundleId();
			req.checkBody('slug', 'Slug is required').isSlug();
			req.checkBody('repository', 'Repository needs to be a URL').isURL();
			req.checkBody('location', 'Location needs to be a URL').isURL();
			req.checkBody('description').optional();
			req.checkBody('thumbnail').optional();

			var errors = req.validationErrors();

			if (errors) return done(errors);

			// Set defaults to false for capabilities
			// so the default that are set to true actually
			// get updated
			defaultCapabilities(req.body.capabilities);

			req.body.updated = Date.now();

			// Update the game
			Game.findByIdAndUpdate(game._id, req.body, done);
		},
		removeGame: function(done, game)
		{
			game.remove(function(err)
			{
				if (err) return done(err);
				res.redirect('/');
			});
		},
		restoreGame: function(done, game) {
			var gameRestore = new GameRestore(game.toObject());

			gameRestore.save(function(err, archive)
			{
				if (err)
				{
					return done(err);
				}

				game.remove(function(err)
				{
					if (err) return done(err);
					res.redirect('/');
				});
			});
		}
	});
});

router.get('/:slug', function(req, res)
{
	renderPage(req, res, 'archive/game');
});

router.get('/:slug/privileges', function(req, res)
{
	renderPage(req, res, 'archive/privileges');
});

router.get('/:slug/release', function(req, res)
{
	res.redirect('/archive/game/' + req.params.slug + '/releases');
});

router.get('/:slug/releases', function(req, res)
{
	renderPage(req, res, 'archive/releases',
		['releases'],
		function(game)
		{
			game.releases.reverse();
		}
	);
});

module.exports = router;
