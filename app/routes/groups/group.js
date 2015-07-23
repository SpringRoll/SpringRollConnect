var router = require('express').Router(),
	Group = require('../../models/group'),
	Game = require('../../models/game'),
	User = require('../../models/user'),
	_ = require('lodash'),
	async = require('async'),
	access = require('../../helpers/access'),
    privilege = access.privilege,
    log = require('../../helpers/logger');

router.get('/:slug', function(req, res)
{
	Group.getBySlug(req.params.slug, false, function(err, group)
	{
		if (!group)
		{
			return res.status(404).render('404');
		}

		if (req.user.privilege < privilege.admin && !req.user.inGroup(group))
		{
			return res.status(401).render('401');
		}

		res.render('groups/group',
		{
			success: req.flash('success'),
			error: req.flash('error'),
			group: group,
			games: Game.getGamesByGroup(group).select('title slug'),
			users: User.getByGroup(group).select('name')
		});
	});
});

router.post('/:slug', access.isAdmin, function(req, res)
{
	async.waterfall(
		[
			function(done)
			{
				Group.getBySlug(req.params.slug, false, done);
			},
			function(group, done)
			{
				if (!group)
				{
					return res.status(404).render('404');
				}
				if (req.body.action == "refreshToken")
				{
					group.refreshToken(function(err, group)
					{
						done(err, "Access token has been refreshed");
					});
				}
				else if (req.body.action == "addUsers")
				{
					var users = req.body.user;
					if (!users) done("No users to add");

					User.addGroup(users, group._id, function(err)
					{
						done(err, "User(s) added to " + group.name);
					});
				}
				else if (req.body.action == "addGames")
				{
					var games = req.body.game;
					if (!games) done("No games to add");

					Game.addGroup(games, group._id, req.body.permission, function(err)
					{
						done(err, "Game(s) added to " + group.name);
					});
				}
				else if (req.body.removeGame)
				{
					Game.removeGroup(req.body.removeGame, group._id, function(err)
					{
						done(err, "Game remove from " + group.name);
					});
				}
				else if (req.body.removeUser)
				{
					User.removeGroup(req.body.removeUser, group._id, function(err)
					{
						done(err, "User removed from " + group.name);
					});
				}
				else
				{
					done("Invalid action");
				}
			}
		], 
		function(err, result)
		{
			if (err)
			{
				req.flash('error', err);
			}
			else
			{
				req.flash('success', result);
			}
			res.redirect(req.originalUrl);
		}
	);
});

module.exports = router;