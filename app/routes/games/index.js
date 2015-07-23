var router = require('express').Router(),
	Game = require('../../models/game.js');

router.post('/', function(req, res)
{
	res.redirect('/games/game/'+req.body.slug);
});

router.get('/', function(req, res)
{
	res.render('select',
	{
		itemName: 'Game',
		itemProperty: 'slug',
		itemKey: 'slug',
		itemValue: 'title',
		items: Game.getAll().select('title slug').sort('title')
	});
});

module.exports = router;