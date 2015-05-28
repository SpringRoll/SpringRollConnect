var _ = require('lodash');
var privilege = {
	subscriber: 0,
	editor: 1,
	admin: 2 
};

module.exports = {
	
	// The privilege map
	privilege: privilege,

	// If the user is logged in
	isAuthenticated : function(req, res, next) 
	{
		if (req.isAuthenticated())
			return next();
		req.flash('redirect', req.originalUrl);
		res.redirect('/login');
	},

	// Access function if user is not logged in
	isAnonymous: function(req, res, next)
	{
		if (!req.isAuthenticated())
			return next();
		res.redirect('/');
	},
	// Editor privilege can:
	// - create a new project
	// - delete a project
	// - manage groups for which you're a member
	isEditor: function(req, res, next)
	{
		if (req.isAuthenticated())
		{
			if (req.user.privilege >= privilege.editor)
				return next();
			res.redirect('/');
		}			
		req.flash('redirect', req.originalUrl);
		res.redirect('/login');
	},
	// Admin can:
	// - create a new group
	// - manage existing groups
	// - change group permissions
	isAdmin: function(req, res, next)
	{
		if (req.isAuthenticated())
		{
			if (req.user.privilege >= privilege.admin)
				return next();
			return res.redirect('/');
		}
		req.flash('redirect', req.originalUrl);
		res.redirect('/login');
	}
};