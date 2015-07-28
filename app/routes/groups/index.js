var router = require('express').Router(),
	async = require('async'),
    log = require('../../helpers/logger'),
	User = require('../../models/user'),
	Group = require('../../models/group');

router.post('/', function(req, res)
{
	res.redirect('/groups/group/'+req.body.slug);
});

router.get('/', function(req, res)
{
	res.render('select',
	{
		itemName: 'Group',
		itemProperty: 'slug',
		itemKey: 'slug',
		items: Group.getTeams().select('name slug'),
		error: req.flash('error'),
		errors: req.flash('errors'),
		success: req.flash('success')
	});
});

module.exports = router;