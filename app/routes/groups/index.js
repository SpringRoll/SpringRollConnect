var router = require('express').Router(),
	async = require('async'),
    log = require('../../helpers/logger'),
	User = require('../../models/user'),
	Group = require('../../models/group');

router.post('/', function(req, res)
{
	var action = req.body.action;

	Group.getById(req.body.groupId, function(err, group)
	{
		// Invalid user id
		if (!group)
		{
			req.flash('error', 'Group is invalid');
			return res.redirect('/groups');
		}

		// Update the group
		if (action == "save")
		{
			req.checkBody('name', 'Name is required').notEmpty();
			req.checkBody('slug', 'Slug is required').isSlug();
			req.checkBody('privilege', 'Privilege must be valid').isInt();

			var errors = req.validationErrors();

			if (errors)
			{
				req.flash('errors', errors);
				render(group, req, res);
			}
			else
			{
				group.name = req.body.name;
				group.slug = req.body.slug;
				group.privilege = req.body.privilege;
				group.logo = req.body.logo;

				if (req.body.tokenExpiresRefresh == "1")
					group.tokenExpires = Group.getTokenExpires();

				if (req.body.tokenExpiresRefresh == "-1")
					group.tokenExpires = null;

				async.waterfall([
					function(done)
					{
						// Remove all users
						User.removeGroup(null, group._id, done);
					},
					function(num, done)
					{
						// Add new users, if any
						var users = req.body.user;
						if (!users) done(null);
						User.addGroup(users, group._id, done);
					},
					function(num, done)
					{
						if (req.body.refreshToken)
						{
							// Refresh the token this also saves the group
							group.refreshToken(done);
						}
						else
						{
							// Do a regular ol' save
							group.save(done);
						}
					}
				], 
				function(err, group)
				{
					if (err)
					{
						log.error(err);
						console.error(err);
						req.flash('error', 'Unable to update the group: ' + err);
					}
					else
					{
						req.flash('success', 'Saved group!');
					}
					render(group, req, res);
				});
			}
		}
		// delete the group
		else if (action == "delete")
		{
			// Remove the group
			group.remove(function(err)
			{
				req.flash('success', 'Deleted ' + group.name + ' successfully.');
				res.redirect('/groups');
			});
		}
		else
		{
			render(group, req, res);
		}
	});
});


function render(group, req, res)
{
	return res.render('groups/edit', 
	{
		group: group,
		users: User.getByGroup(group).select('name slug'),
		error: req.flash('error'),
		errors: req.flash('errors'),
		success: req.flash('success')
	});
}

router.get('/', function(req, res)
{
	res.render('select',
	{
		itemName: 'Group',
		itemProperty: 'groupId',
		items: Group.getTeams(),
		error: req.flash('error'),
		errors: req.flash('errors'),
		success: req.flash('success')
	});
});

module.exports = router;