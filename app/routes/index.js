module.exports = function(app)
{
	var access = require('../helpers/access');
	var marky = require("marky-markdown");
	var Config = require('../models/config');

	// Add the user to whatever template
	app.use(function(req, res, next)
	{
		res.locals.fullYear = new Date().getFullYear();
		res.locals.url = req.originalUrl;
		res.locals.user = req.user;
		res.locals.privilege = access.privilege;
		res.locals.moment = require('moment');
		res.locals.version = app.get('version');
		res.locals.marked = function(str)
		{
			return marky(str).html();
		};
		res.locals.isActive = function(url, undefined)
		{
			var isCurrent = (url instanceof RegExp) ? 
				url.test(req.originalUrl):
				url == req.originalUrl;
			return isCurrent ? 'active' : undefined;
		};
		next();
	});

	// Get the configuration
	app.use(function(req, res, next)
	{
		Config.getConfig(function(err, config)
		{
			global.CONFIGURATION = res.locals.config = config || new Config();
			next();
		});
	});

	// Site pages
	app.use('/', require('./home'));
	app.use('/embed', require('./embed'));
	app.use('/docs', access.isAuthenticated, require('./docs'));
	app.use('/games/add', access.isEditor, require('./games/add'));
	app.use('/games/game', access.isAuthenticated, require('./games/game'));
	app.use('/games/search', access.isAdmin, require('./games/search'));
	app.use('/groups/add', access.isAdmin, require('./groups/add'));
	app.use('/games', access.isEditor, require('./games/index'));
	app.use('/groups/group', access.isAuthenticated, require('./groups/group'));
	app.use('/groups/search', access.isAdmin, require('./groups/search'));
	app.use('/groups', access.isAdmin, require('./groups/index'));
	app.use('/users/search', require('./users/search'));
	app.use('/users/add', access.isAdmin, require('./users/add'));
	app.use('/users', access.isAdmin, require('./users/index'));
	app.use('/configuration', access.isAdmin, require('./configuration'));

	// RESTful service for releases
	app.use('/api/release', require('./api/release'));
	app.use('/api/releases', require('./api/releases'));

	// Authentication Pages
	app.use('/login', access.isAnonymous, require('./login'));
	app.use('/logout', access.isAuthenticated, require('./logout'));
	app.use('/register', access.isAnonymous, require('./register'));
	app.use('/forgot', access.isAnonymous, require('./forgot'));
	app.use('/reset', access.isAnonymous, require('./reset'));
	app.use('/profile', access.isAuthenticated, require('./profile'));
	app.use('/password', access.isAuthenticated, require('./password'));

	// All other pages default to 404
	app.all('*', function(req, res)
	{
		res.status(404).render('404');
	});
};