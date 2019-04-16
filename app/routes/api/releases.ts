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
  const release = {};
  const getPublicReleases = () =>
    getRepository(Game)
      .findOne({
        where: [
          { slug: req.params.slugBundleID },
          { bundleId: req.params.slugBundleID }
        ]
      })
      .then(({ uuid }) => {
        const query = {
          ...release,
          gameUuid: uuid,
          status: 'prod',
          order: { updated: 'DESC' }
        };
        const releaseRepository = getRepository(Release);
        return req.query.multi
          ? releaseRepository.find(query)
          : <any>releaseRepository.findOne(query);
      });

  const getPrivateReleases = () =>
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
          .getOne()
      )

      .then(({ game }) => {
        const query = <object>{
          where: { ...release, gameUuid: game.uuid },
          order: { updated: 'DESC' }
        };
        const releaseRepository = getRepository(Release);

        return req.query.multi
          ? releaseRepository.find(query)
          : <any>releaseRepository.findOne(query);
      });

  if (req.query.status) {
    release['status'] = req.query.status;
  }

  if (req.query.commitId) {
    release['commitId'] = req.query.commitId;
  }

  if (req.query.version) {
    release['version'] = req.query.version;
  }

  (req.query.token ? getPrivateReleases() : getPublicReleases()).then(
    releases =>
      res.send({
        success: true,
        data: releases
      })
  );
});

module.exports = router;
