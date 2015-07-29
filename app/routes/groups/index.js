var router = require('express').Router(),
	async = require('async'),
    log = require('../../helpers/logger'),
	Pagination = require('../../helpers/pagination'),
	Group = require('../../models/group');

router.get('/:local(page)?/:number([0-9]+)?', function(req, res)
{
	Group.getTeams().count(function(err, count)
	{
		var nav = new Pagination('/groups', count, req.params.number);
		res.render('groups/index',
		{
			pagination: nav.result,
			groups: Group.getTeams()
				.select('name slug logo')
				.sort('name')
				.skip(nav.start || 0)
				.limit(nav.itemsPerPage),
			error: req.flash('error'),
			errors: req.flash('errors'),
			success: req.flash('success')
		});
	});
});

module.exports = router;