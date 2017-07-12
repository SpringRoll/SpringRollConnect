var router = require('express').Router(),
	Game = require('../../models/game-archive'),
	Pagination = require('../../helpers/pagination');

router.get('/:order(alphabetical|latest)?/:local(page)?/:number([0-9]+)?', function(req, res)
{
	var order = req.params.order || 'alphabetical';

	Game.getAll().count(function(err, count)
	{
		var nav = new Pagination('/archive/'+order, count, req.params.number);
		res.render('archive/index',
		{
			pagination: nav.result,
			order: order,
			games: Game.getAll()
				.select('title slug thumbnail releases')
				.sort(order == 'alphabetical' ? 'title' : '-updated')
				.skip(nav.start || 0)
				.limit(nav.itemsPerPage)
		});
	});

});

module.exports = router;
