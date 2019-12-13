var router = require('express').Router(),
  async = require('async'),
  Game = require('../../models/game'),
  Group = require('../../models/group'),
  Release = require('../../models/release'),
  cache = require('../../helpers/cache'),
  response = require('../../helpers/response'),
  log = require('../../helpers/logger');

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

router.post('/:slug', function(req, res) {
  req
    .checkBody('status', 'Status must be one of: "dev", "qa", "stage", "prod"')
    .isStatus();
  req
    .checkBody('commitId', 'Commit ID must be a valid Git commit has')
    .isCommit();
  req.checkBody('token', 'Token is required').isToken();
  req.checkBody('branch', 'Branch is required and must be a string').isBranch();

  if (req.body.verison)
    req
      .checkBody('version', 'Not a properly formatted Semantic Version')
      .isSemver();

  var errors = req.validationErrors();

  if (errors) {
    log.error('Validation error adding release from token ' + req.body.token);
    log.error(errors);

    if (req.body.redirect) {
      log.warn('Redirecting to ' + req.body.redirect);
      res.redirect(req.body.redirect);
    } else {
      res.send({
        success: false,
        data: errors
      });
    }
    return;
  }

  async.waterfall(
    [
      function(done) {
        Game.getBySlugOrBundleId(req.params.slug, done).select('-thumbnail');
      },
      function(game, done) {
        game.hasPermission(req.body.token, done);
      },
      function(game, done) {
        // Better handling of a unique commitId
        Release.getByCommitId(req.body.commitId, function(err, release) {
          if (!!req.body.warnUniqueCommit && !!release) {
            done('The Commit ID is already taken');
          } else {
            done(err, game, release);
          }
        });
      },
      async function(game, release, done) {
        // If we already have a release
        // lets just modify the updated timestamp
        // and leave everything else the same
        if (release) {
          release.updated = Date.now();
          release.save(function(err) {
            done(err, game);
          });
          return;
        }
        var values = Object.assign({}, values, req.body);
        values.game = game._id;
        delete values.token;
        values.created = values.updated = Date.now();

        // If the capabilities aren't set, inherit the
        // default game capabilities
        if (!values.capabilities) {
          values.capabilities = game.capabilities.toObject();
        } else {
          // Or else update the game defaults
          Object.assign(
            game.capabilities,
            Object.assign({}, values.capabilities)
          );
          await game.save();
        }
        var newRelease = new Release(values);
        newRelease.save(function(err, release) {
          if (err) {
            return done(err, game);
          }

          //game.releases.push(release._id);
          game.releases = game.releases.concat([release._id]);
          game.updated = Date.now();
          game.save(function(err) {
            done(err, game);
          });
        });
      },
      function(game, done) {
        Release.getByIdsAndStatus(game.releases, 'dev', function(
          err,
          releases
        ) {
          var maxDevReleases = CONFIGURATION.maxDevReleases;
          if (releases.length > maxDevReleases) {
            let toSave = [];
            while (toSave.length < maxDevReleases) {
              //toSave.push(releases.pop());
              toSave = toSave.concat([releases.pop()]);
            }
            releases.forEach(function(release) {
              Release.removeById(release._id, function() {});
            });
          }
          done(null, game);
        });
      }
    ],
    function(err, result) {
      if (err) {
        log.error('Unable to add the release for token ' + req.body.token);
        log.error(err);

        if (req.body.redirect) {
          res.redirect(req.body.redirect);
        } else {
          res.status(500).send({
            success: false,
            data: 'Unable to add the release'
          });
        }
        return;
      }

      if (req.body.redirect) {
        res.redirect(req.body.redirect);
      } else {
        res.send({
          success: true,
          data: result
        });
      }
    }
  );
});

router.get('/:slugOrBundleId', cache, function(req, res) {
  req
    .checkQuery('token')
    .optional()
    .isToken();
  req
    .checkQuery('status')
    .optional()
    .isStatus();
  req
    .checkQuery('commitId')
    .optional()
    .isCommit();
  req
    .checkQuery('version')
    .optional()
    .isSemver();

  if (req.validationErrors()) {
    return response.call(res, 'Invalid arguments');
  }
  Release.getByGame(
    req.params.slugOrBundleId,
    {
      version: req.query.version,
      commitId: req.query.commitId,
      archive: req.query.archive,
      status: req.query.status || 'prod',
      token: req.query.token,
      debug: req.query.debug
    },
    function(err, release) {
      if (err === null && release !== null) {
        // if there's no error and a release was found
        return res.send({ success: true, data: release });
      } else if (err === null && release === null) {
        // no release was found, so it's a 404
        log.warn(`No release found for slug "${req.params.slugOrBundleId}"`);
        return res.status(404).send({ success: false, data: null });
      }

      if (err === 'Invalid game slug') {
        // If the slug doesn't exist, it's a 404
        log.warn(`Invalid game slug "${req.params.slugOrBundleId}"`);
        return res.status(404).send({ success: false, error: err });
      } else if (err === 'Token is required') {
        // If the request was for a dev game without a token, it's a 403
        log.warn(`Request for game "${req.params.slugOrBundleId}" without token`);
        return res.status(403).send({ success: false, error: err });
      } else {
        // Otherwise, we don't know what it is so it's probably a 500
        log.warn(err);
        return res.status(500).send({ success: false, data: null });
      }
    }
  );
});

module.exports = router;
