import { Router, Request } from 'express';
import {
  Game,
  Release,
  mapCapabilities,
  Group,
  GroupPermission
} from '../../db';
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

const mapResponse = ({
  capabilities,
  releases,
  title,
  slug,
  location
}: Game) => ({
  capabilities,
  commitId: releases[0].commitId,
  game: {
    title,
    slug,
    location
  },
  url: `${location}/${releases[0].commitId}/release/index.html`,
  updated: releases[0].updated
});

router.post('/:slug', (req, res) => {
  return 'undefined' === typeof req.body.token
    ? res.send({
        success: false,
        data: 'Missing Required Token'
      })
    : getRepository(Game)
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
            gameUuid: uuid,
            updatedBy: undefined,
            capabilities: mapCapabilities(
              req.body.capabilities ? req.body.capabilities : {}
            )
          });

          return validate(release, { skipMissingProperties: true }).then(
            errors => {
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
            }
          );
        });
});

router.get('/:slugOrBundleId', function(req, res) {
  if (req.query.status && 'prod' !== req.query.status) {
    if (!req.query.token) {
      return res
        .status(404)
        .send({ success: false, data: 'Access Token Missing' });
    }
    return getRepository(Group)
      .findOne({ where: { token: req.query.token } })
      .then(({ id }) =>
        getRepository(GroupPermission)
          .createQueryBuilder('gp')
          .select()
          .where('gp.groupID = :group', { group: id })
          .leftJoinAndSelect('gp.game', 'game')
          .leftJoinAndSelect('game.releases', 'release')
          .andWhere(
            'game.slug = :slug AND release.status = :status OR game.bundleId = :slug AND release.status = :status',
            {
              slug: req.params.slugOrBundleId,
              status: req.query.status
            }
          )
          .orderBy('release.created', 'DESC')
          .getOne()
          .then(({ game }) =>
            res.send({ success: true, data: mapResponse(game) })
          )
          .catch(err => res.status(404).send({ success: false, data: err }))
      );
  }

  const prod = `AND release.status = 'prod'`;
  return getRepository(Game)
    .createQueryBuilder('game')
    .leftJoinAndSelect('game.releases', 'release')
    .where(`game.slug = :slug ${prod} OR game.bundleId = :slug ${prod}`, {
      slug: req.params.slugOrBundleId
    })
    .orderBy('release.created', 'DESC')
    .getOne()
    .then(game => res.send({ success: true, data: mapResponse(game) }))
    .catch(err =>
      res.status(404).send({ success: false, data: 'No Release Available' })
    );
});

module.exports = router;
