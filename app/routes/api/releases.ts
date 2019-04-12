import { Router } from 'express';
import { Game, Release, Group, GroupPermission } from '../../db';
import { getRepository } from 'typeorm';

const router = Router();

router.use(function(_, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//TODO: Re-implement
// router.post('/clean', function(req, res) {
//   var devExpireDays = CONFIGURATION.devExpireDays;
//   var moment = require('moment');
//   var expiration = moment()
//     .subtract(devExpireDays, 'days')
//     .toDate();

//   Release.find({ created: { $lt: expiration } })
//     .select('commitId game')
//     .populate('game', 'slug')
//     .exec(function(err, releases) {
//       if (releases && releases.length) {
//         Release.removeById(releases.map(release => release._id), function() {
//           res.send(releases);
//         });
//       } else {
//         res.send(releases);
//       }
//     });
// });

// router.get('/:slugBundleID', function(req, res) {
//   console.log('called', 'test');
//   const release = { status: 'prod' };

//   if (req.query.status && 'prod' !== req.query.status) {
//     console.log(req.query);
//     if (!req.query.token) {
//       return res.status(404).send({ success: false, data: null });
//     }

//     getRepository(Group)
//       .findOne({ where: { token: req.query.token } })
//       .then(({ id }) =>
//         getRepository(GroupPermission)
//           .createQueryBuilder('gp')
//           .select(['gp.gameID'])
//           .where('gp.groupID = :group', { group: id })
//           .leftJoinAndSelect('gp.game', 'game')
//           .where('game.slug = :slug OR game.bundleId = :slug', {
//             slug: req.params.slugBundleID
//           })
//           .leftJoinAndSelect('game.releases', 'release')
//           .andWhere('release.status = :status', { status: req.query.status })
//           .getMany()
//           .then(result => {
//             console.log(result);
//             return res.send({ success: false, data: null });
//           })
//       );
//   }

//   if (req.body.commitId) {
//     release['commitId'] = req.query.commitId;
//   }

//   if (req.body.status) {
//     release['status'] = req.query.status;
//   }

// getRepository(Game)
//   .find({
//     where: [
//       { slug: req.params.slugBundleID, ...release },
//       { bundleId: req.params.slugBundleID, ...release }
//     ],
//     join: {
//       alias: 'game',
//       leftJoinAndSelect: {
//         game: 'game.release'
//       }
//     }
//   })

//   .then(releases => {
//     console.log(releases);
//     return res.send({
//       success: false,
//       data: null
//     });
//   });
// Release.getByGame(
//   req.params.slugOrBundleId,
//   {
//     version: req.query.version,
//     commitId: req.query.commitId,
//     archive: req.query.archive,
//     status: req.query.status,
//     token: req.query.token,
//     debug: req.query.debug,
//     multi: true
//   },
//   response.bind(res)
// );
// });

module.exports = router;
