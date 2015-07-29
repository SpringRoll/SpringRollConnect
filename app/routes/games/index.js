var router = require('express').Router(),
	Game = require('../../models/game'),
	Pagination = require('../../helpers/pagination');

router.get('/:local(page)?/:number([0-9]+)?', function(req, res)
{
	Game.getAll().count(function(err, count)
	{
		var nav = new Pagination('/games', count, req.params.number);
		res.render('games/index',
		{
			pagination: nav.result,
			games: Game.getAll()
				.select('title slug thumbnail releases')
				.sort('title')
				.skip(nav.start || 0)
				.limit(nav.itemsPerPage)
		});
	});
});

module.exports = router;