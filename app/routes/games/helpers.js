const async = require('async'),
	http = require('http'),
	https = require('https'),
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
 * Convert bytes into a human readable format
 * source: https://stackoverflow.com/a/20732091/10236401
 * thanks andrew!
 * 
 * @param  {integer} size file size that we want to convert
 * @return {string}       file size in human readable format
 */
function niceFileSize(size) {
	const i = Math.floor( Math.log(size) / Math.log(1024) );
	
	return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
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
					game.populate({
						path: populate,
						options: { sort: { 'updated': -1 } }
					});
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
		async function(err, game, access)
		{
			if (err)
			{
				return res.status(401).render('401');
			}

			// Gets the page index if the page supports query string pages
			const pages = Math.ceil(game.releases.length / 10);

			const pageIndex =
				// Verify that the page is passed a number
				req.query &&
				req.query.page &&
				Number.isInteger(Number(req.query.page)) &&
				// Check to make sure it's greater than zero
				0 < req.query.page
					// Check to make sure that it's not greater than the maximum
					? req.query.page > pages
						? pages
						: Number(req.query.page)
					: 1;

			// iterate game releases to add file sizes
			for (let k = 0; k < game.releases.length; k++) {
				const compressedSize = parseInt(game.releases[k].releaseCompressedSize || 0);
				if (compressedSize > 0) {
					game.releases[k].releaseCompressedSize = niceFileSize(compressedSize);
				}
				const uncompressedSize = parseInt(game.releases[k].releaseUncompressedSize || 0);
				if (uncompressedSize > 0) {
					game.releases[k].releaseUncompressedSize = niceFileSize(uncompressedSize);
				}
			}

			res.render(template, {
			game: game,
			page: pageIndex,
			totalPages: pages,
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
					return;
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