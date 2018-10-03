var router = require('express').Router();
var Game = require('../../models/game');

router.post('/', function(req, res) {
  var searches;
  if (req.body.slug) {
    searches = [
      Game.getBySlug(req.body.slug).select('slug'),
    ];
  } else if (req.body.bundleId) {
    searches = [
      Game.getByBundleId(req.body.bundleId).select('slug'),
    ];
  } else if (req.body.search) {
    searches = [
      Game.getBySearch(req.body.search, 10),
    ];
  }

  Promise.all(searches).then(function(data) {
    data = JSON.parse(JSON.stringify(data));
    if (null !== data[0]) {
      for (var i = 0; i < data[0].length; i++) {
        data[0][i].url = '/games/game/';
      }
    }
    //TODO: Get fix for this from other branch
    if (null !== data[0]) {
      for (var n = 0; n < data[1].length; n++) {
        data[1][n].url = '/archive/game/';
      }
    }

    res.send([].concat.apply([], data));
  });
});

module.exports = router;
