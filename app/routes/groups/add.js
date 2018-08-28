var router = require('express').Router(),
	Group = require('../../models/group'),
	User = require('../../models/user'),
	async = require('async'),
    log = require('../../helpers/logger');

router.post('/', function(req, res)
{
	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('privilege', 'Privilege needs to be a number').isNumeric();
	req.checkBody('slug', 'Slug must be alpha numeric characters').isSlug();

	var errors = req.validationErrors();

	if (errors)
	{
		res.render('groups/add', {
			errors: errors
		});
		return;
	}

	async.waterfall(
		[
			function(done)
			{
				Group.getBySlug(req.body.slug, function(err, group)
				{
					done(group ? 'Slug is already taken': null);
				});
			},
			function(done)
			{
				Group.generateToken(done);
			},
			function(token, done)
			{
				var expires = null;

				if (req.body.tokenExpires)
					expires = Group.getTokenExpires();

				var group = new Group({
					name: req.body.name,
					privilege: req.body.privilege,
					slug: req.body.slug,
					logo: req.body.logo,
					token: token,
					tokenExpires: expires,
					isUserGroup: false,
					games: []
				});
				group.save(function(err, group)
				{
					done(err, group);
				});
			},
			function(group, done)
			{
				var users = req.body.user;

				// Ignore no users
				if (!users) done(null, true);
				
				User.addGroup(users, group._id, function(err, users)
				{
					done(null, users);
				});
			}
		],
		function(err, result)
		{
			if (err)
			{
				log.error("Unable to add group");
				log.error(err);
				console.log(String(err).red);
				return res.render('groups/add', {
					error: 'Unable to add the group: ' + err
				});
			}
			res.render('groups/add', {
				success: 'Group added successfully'
			});
		}
	);
});

router.get('/', function(req, res)
{
	res.render('groups/add');
});

module.exports = router;