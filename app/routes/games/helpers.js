const async = require('async'),
  log = require('../../helpers/logger'),
  Game = require('../../models/game'),
  User = require('../../models/user');

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

function validateRequest(req){
  req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('bundleId', 'Bundle ID is required').isBundleId();
	req.checkBody('slug', 'Slug is required').isSlug();
	req.checkBody('repository', 'Repository needs to be a URL').isURL();
	req.checkBody('location', 'Location needs to be a URL').isURL();
	req.checkBody('description').optional();
  req.checkBody('thumbnail').optional();
  var errors = req.validationErrors();
	return errors ? errors : false;
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
function renderPage(req, res, template, populate=null)
{
	async.waterfall(
		[
			function(done)
			{
        var game = Game.getBySlug(req.params.slug, done);
        if (populate){
          game.populate(populate);
				};
      },
			function(game, done)
			{
				if (!game){ 
					return res.status(404).render('404');
				}

				game.getAccess(req.user, done);
			}
		],
		function(err, game, access)
		{
			if (err)
			{
				return res.status(401).render('401');
			}
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
				if (!game) {
					return res.status(404).render('404');
				}

				game.getAccess(req.user, done);
			},
			function(game, access, done)
			{
				var response = function(err)
				{
					if (err) {
						return done(err);
					}
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
			if (err) {
				return handleError(req, res, err);
			}

			req.flash('success', game.title + " updated successfully");
			res.redirect(req.body.slug ? req.baseUrl + `/${req.body.slug}` : req.originalUrl);
		}
	);
}

function defaultCapabilities(capabilities)
{
	capabilities.ui = Object.assign({
		mouse: false,
		touch: false
	}, capabilities.ui);

	capabilities.sizes = Object.assign({
			xsmall: false,
			small: false,
			medium: false,
			large: false,
			xlarge: false
		}, capabilities.sizes);
}

module.exports = {renderPage, postPage, defaultCapabilities, validateRequest, handleError};