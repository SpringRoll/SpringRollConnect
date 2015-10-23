var router = require('express').Router();
var Group = require('../models/group');
var access = require('../helpers/access');
var log = require('../helpers/logger');
var _ = require('lodash');
var Pagination = require('../helpers/pagination');
var flash = require('connect-flash');
router.get('/:local(page)?/:number([0-9]+)?', function(req, res)
{
	if (req.isAuthenticated())
	{
		req.user.getGames().count(function(err, count)
		{
			var nav = new Pagination('', count, req.params.number);
			res.render('home', {
				success: req.flash('success'),
				error: req.flash('error'),
				games: req.user.getGames()
					.select('title slug releases thumbnail updated')
					.sort('-updated')
					.skip(nav.start || 0)
					.limit(nav.itemsPerPage),
				pagination: nav.result,
				groups: _.filter(req.user.groups, 'isUserGroup', false)
			});
		});
	}
	else
	{
		res.render('login', {
			error: req.flash('error'),
			redirect: req.flash('redirect')
		});
	}
});

router.post('/', function(req, res)
{
	Group.findById(req.body.group, function(err, group)
	{
		if (err)
		{
			console.log(String(err).red);
			log.error("Unable to change personal token");
			log.error(err);
			req.flash('error', 'Something went wrong');
			res.redirect('/');
		}
		else if (!group)
		{
			req.flash('error', 'Unable to get user group');
			res.redirect('/');
		}
		else
		{
			group.refreshToken(function(err, group)
			{
				if (err)
				{
					req.flash('error', "Unable to refresh token");
				}
				else
				{
					req.flash('success', "Access token has been refreshed");
				}
				res.redirect('/');
			});
		}
	});
});

module.exports = router;
