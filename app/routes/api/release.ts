import { Router, Request } from 'express';
import { log } from '../../helpers';
import { Game, Release, mapCapabilities } from '../../db';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
const router = Router();

router.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  return next();
});

router.post('/:slug', (req: Request & { checkBody; validationErrors }, res) => {
  req
    .checkBody('status', 'Status must be one of: "dev", "qa", "stage", "prod"')
    .isStatus();
  req
    .checkBody('commitId', 'Commit ID must be a valid Git commit has')
    .isCommit();
  req.checkBody('token', 'Token is required').isToken();
  req.checkBody('branch', 'Branch is required and must be a string').isBranch();

  if (req.body.verison) {
    req
      .checkBody('version', 'Not a properly formatted Semantic Version')
      .isSemver();
  }

  {
    const errors = req.validationErrors();
    if (errors) {
      log.error('Validation error adding release from token ' + req.body.token);
      log.error(errors);
      return res.send({
        success: false,
        data: errors
      });
    }
  }

  getRepository(Game)
    .findOne({
      where: { slug: req.params.slug },
      select: ['uuid'],
      join: {
        alias: 'game',
        leftJoinAndSelect: {
          groups: 'game.groups',
          group: 'groups.group'
        }
      }
    })
    .then(({ uuid, groups }) => {
      const onFail = (reason: any) =>
        res.send({
          success: false,
          data: reason
        });
      const isValidGroup = groups
        .map(({ group }) => group)
        .find(({ token }) => token === req.body.token);

      if (!isValidGroup) {
        return onFail('Invalid Token');
      }
      const releaseRepository = getRepository(Release);
      const release = releaseRepository.create(<Release>{
        ...req.body,
        game: { uuid },
        updatedBy: undefined,
        capabilities: mapCapabilities(req.body.capabilities)
      });

      return validate(release, { skipMissingProperties: true }).then(errors => {
        if (0 < errors.length) {
          return onFail(errors);
        }
        releaseRepository
          .save(release)
          .then(({ id }) =>
            res.send({
              success: true,
              data: id
            })
          )
          .catch(({ message }) =>
            onFail((<string>message).split('"')[0].trim())
          );
      });
    });
});

// router.post(
//   '/:slug',
//   (req: Request & { checkBody: Function; validationErrors: Function }, res) => {
//     req
//       .checkBody(
//         'status',
//         'Status must be one of: "dev", "qa", "stage", "prod"'
//       )
//       .isStatus();
//     req
//       .checkBody('commitId', 'Commit ID must be a valid Git commit has')
//       .isCommit();
//     req.checkBody('token', 'Token is required').isToken();
//     req
//       .checkBody('branch', 'Branch is required and must be a string')
//       .isBranch();

//     if (req.body.verison)
//       req
//         .checkBody('version', 'Not a properly formatted Semantic Version')
//         .isSemver();

//     const errors = req.validationErrors();

//     if (errors) {
//       log.error('Validation error adding release from token ' + req.body.token);
//       log.error(errors);

//       if (req.body.redirect) {
//         log.warn('Redirecting to ' + req.body.redirect);
//         res.redirect(req.body.redirect);
//       } else {
//         res.send({
//           success: false,
//           data: errors
//         });
//       }
//       return;
//     }

//     async.waterfall(
//       [
//         function(done) {
//           Game.getBySlugOrBundleId(req.params.slug, done).select('-thumbnail');
//         },
//         function(game, done) {
//           game.hasPermission(req.body.token, done);
//         },
//         function(game, done) {
//           // Better handling of a unique commitId
//           Release.getByCommitId(req.body.commitId, function(err, release) {
//             if (!!req.body.warnUniqueCommit && !!release) {
//               done('The Commit ID is already taken');
//             } else {
//               done(err, game, release);
//             }
//           });
//         },
//         function(game, release, done) {
//           // If we already have a release
//           // lets just modify the updated timestamp
//           // and leave everything else the same
//           if (release) {
//             release.updated = Date.now();
//             release.save(function(err) {
//               done(err, game);
//             });
//             return;
//           }
//           var values = Object.assign({}, values, req.body);
//           values.game = game._id;
//           delete values.token;
//           values.created = values.updated = Date.now();

//           // If the capabilities aren't set, inherit the
//           // default game capabilities
//           if (!values.capabilities) {
//             values.capabilities = game.capabilities.toObject();
//           }
//           // Or else update the game defaults
//           else {
//             Object.assign(
//               game.capabilities,
//               Object.assign({}, values.capabilities)
//             );
//             game.save();
//           }
//           var newRelease = new Release(values);
//           newRelease.save(function(err, release) {
//             if (err) return done(err, game);

//             game.releases.push(release._id);
//             game.updated = Date.now();
//             game.save(function(err, result) {
//               done(err, game);
//             });
//           });
//         },
//         function(game, done) {
//           Release.getByIdsAndStatus(game.releases, 'dev', function(
//             err,
//             releases
//           ) {
//             var maxDevReleases = CONFIGURATION.maxDevReleases;
//             if (releases.length > maxDevReleases) {
//               let toSave = [];
//               while (toSave.length < maxDevReleases) {
//                 toSave.push(releases.pop());
//               }
//               releases.forEach(function(release) {
//                 Release.removeById(release._id, function() {});
//               });
//             }
//             done(null, game);
//           });
//         }
//       ],
//       function(err, result) {
//         if (err) {
//           log.error('Unable to add the release for token ' + req.body.token);
//           log.error(err);

//           if (req.body.redirect) {
//             res.redirect(req.body.redirect);
//           } else {
//             res.status(500).send({
//               success: false,
//               data: 'Unable to add the release'
//             });
//           }
//           return;
//         }

//         if (req.body.redirect) {
//           res.redirect(req.body.redirect);
//         } else {
//           res.send({
//             success: true,
//             data: result
//           });
//         }
//       }
//     );
//   }
// );

// router.get('/:slugOrBundleId', function(req, res) {
//   req
//     .checkQuery('token')
//     .optional()
//     .isToken();
//   req
//     .checkQuery('status')
//     .optional()
//     .isStatus();
//   req
//     .checkQuery('commitId')
//     .optional()
//     .isCommit();
//   req
//     .checkQuery('version')
//     .optional()
//     .isSemver();
//   if (req.validationErrors()) {
//     return response.call(res, 'Invalid arguments');
//   }
//   Release.getByGame(
//     req.params.slugOrBundleId,
//     {
//       version: req.query.version,
//       commitId: req.query.commitId,
//       archive: req.query.archive,
//       status: req.query.status || 'prod',
//       token: req.query.token,
//       debug: req.query.debug
//     },
//     response.bind(res)
//   );
// });

module.exports = router;
