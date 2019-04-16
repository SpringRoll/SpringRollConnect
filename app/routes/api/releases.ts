import { Router } from 'express';
import { Game, Release, Group, GroupPermission, Config } from '../../db';
import { getRepository, LessThan } from 'typeorm';
import { DateTime } from 'luxon';

const router = Router();

router.use(function(_, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

router.post('/clean', (_, res) =>
  getRepository(Config)
    .findOne()
    .then(({ devExpireDays }) =>
      getRepository(Release)
        .delete({
          created: LessThan(
            DateTime.utc()
              .minus({ days: devExpireDays })
              .toJSDate()
          )
        })
        .then(results => res.send(results))
    )
);

router.get('/:slugBundleID', function(req, res) {
  const release = { status: 'prod' };

  if (req.query.status && 'prod' !== req.query.status) {
    if (!req.query.token) {
      return res.status(404).send({ success: false, data: null });
    }

    getRepository(Group)
      .findOne({ where: { token: req.query.token } })
      .then(({ id }) =>
        getRepository(GroupPermission)
          .createQueryBuilder('gp')
          .select(['gp.gameID'])
          .where('gp.groupID = :group', { group: id })
          .leftJoinAndSelect('gp.game', 'game')
          .where('game.slug = :slug OR game.bundleId = :slug', {
            slug: req.params.slugBundleID
          })
          .leftJoinAndSelect('game.releases', 'release')
          .andWhere('release.status = :status', { status: req.query.status })
          .getMany()
          .then(result => {
            console.log(result);
            return res.send({ success: false, data: null });
          })
      );
  }

  if (req.body.commitId) {
    release['commitId'] = req.query.commitId;
  }

  if (req.body.status) {
    release['status'] = req.query.status;
  }

  getRepository(Game)
    .find({
      where: [
        { slug: req.params.slugBundleID, ...release },
        { bundleId: req.params.slugBundleID, ...release }
      ],
      join: {
        alias: 'game',
        leftJoinAndSelect: {
          game: 'game.release'
        }
      }
    })

    .then(releases => {
      console.log(releases);
      return res.send({
        success: false,
        data: null
      });
    });
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
});

module.exports = router;
