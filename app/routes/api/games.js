var router = require('express').Router(),
  async = require('async'),
  Release = require('../../models/release'),
  Group = require('../../models/group'),
  Game = require('../../models/game'),
  cache = require('../../helpers/cache'),
  log = require('../../helpers/logger'),
  response = require('../../helpers/response');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

router.get('/', cache, function(req, res) {
  req
    .checkQuery('status')
    .optional()
    .isStatus();
  req
    .checkQuery('token')
    .optional()
    .isToken();

  if (req.validationErrors()) {
    let message = '';
    req.validationErrors().forEach(error => {
      message += `${error.msg}: ${error.param}. `;
    });

    return res.status(422).send({
      success: false,
      error: message
    });
  }

  var status = req.query.status || 'prod';
  var token = req.query.token;
  var statuses = ['dev', 'qa', 'stage', 'prod'];

  // The status is inclusive of status levels greater than the current
  // for instance, QA status means the latest QA, Stage or Prod release
  statuses = statuses.slice(statuses.indexOf(status));

  var populateOptions = {
    path: 'releases',
    select:
      'status updated commitId version debugCompressedSize debugUncompressedSize releaseCompressedSize releaseUncompressedSize',
    match: { status: { $in: statuses } },
    options: {
      sort: { updated: -1 },
      limit: 1
    }
  };

  async.waterfall(
    [
      function(done) {
        // Require token
        if (status == 'prod') {
          return Game.getAll(done)
            .select('-thumbnail')
            .populate(populateOptions);
        } else if (!token) {
          return done('No token');
        }
        Group.getByToken(token, function(err, group) {
          if (err) {
            return done(err);
          } else if (!group) {
            return done('Invalid token');
          }
          Game.getGamesByGroup(group, done)
            .select('-thumbnail')
            .populate(populateOptions);
        });
      }
    ],
    function(err, games) {
      if (err === 'No token' || err === 'Invalid token') {
        log.warn(err + ' request for api/games');
        return res.status(403).send({
          success: false,
          error: err
        });
      } else if (err) {
        log.warn(err);

        return res.status(400).send({
          success: false,
          error: err
        });
      }

      games = games.reduce((filteredGames, game) => {
        //removes any game that doesn't have a release of the specified type
        if (game.releases.length > 0 || !req.query.status) {
          //update the url
          game.releases.forEach(release => {
            release.url =
              game.location +
              '/' +
              release.commitId +
              '/' +
              (req.query.debug === 'true' ? 'debug' : 'release') +
              (req.query.archive === 'true' ? '.zip' : '/index.html');
          });
          filteredGames.push(game);
        }
        return filteredGames;
      }, []);

      return res.send({
        success: true,
        data: games
      });
    }
  );
});

module.exports = router;
