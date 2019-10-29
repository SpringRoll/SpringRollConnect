import { Router } from 'express';
import { Release, Group, Game } from '../../db';
import { getRepository, In, QueryBuilder } from 'typeorm';

const router = Router();

router.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

router.get('/', (req, res) => {
  let statuses = ['dev', 'qa', 'stage', 'prod'];
  const status = req.query.status || 'prod';

  // The status is inclusive of status levels greater than the current
  // for instance, QA status means the latest QA, Stage or Prod release
  statuses = statuses.slice(statuses.indexOf(status));

  let tokenlessQueryBuilder = getRepository(Game)
    .createQueryBuilder('game')
    .leftJoinAndSelect('game.releases', 'release', `release.status = 'prod'`)
    .orderBy('game.updated', 'DESC');

  //If status is defined as prod then only grab games with a prod release.
  if (req.query.status === 'prod') {
    tokenlessQueryBuilder = getRepository(Game)
      .createQueryBuilder('game')
      .innerJoinAndSelect('game.releases', 'release', `release.status = 'prod'`)
      .orderBy('game.updated', 'DESC');
  }

  (req.query.token
    ? getRepository(Group)
        .findOne({ token: req.query.token })
        .then(group => group.getPermittedGameIds())
        .then(uuids =>
          0 < uuids.length
            ? getRepository(Game)
                .createQueryBuilder('game')
                .where('uuid IN (:...uuids)', { uuids: uuids })
                .leftJoinAndSelect(
                  'game.releases',
                  'release',
                  'release.status IN (:...statuses)',
                  { statuses: statuses }
                )
                .leftJoinAndSelect('game.groups', 'groups')
                .orderBy('game.updated', 'DESC')
                .getMany()
            : // getRepository(Game).find({
              //     where: { uuid: In(uuids) },
              //     order: { updated: 'DESC' },
              //     relations: ['releases', 'groups']
              //   })
              []
        )
    : tokenlessQueryBuilder.getMany()
  )
    .then(games =>
      games.map(game => {
        //ensures that the releases are sorted by date (descending)
        game.releases.sort((a, b) => {
          return b.updated - a.updated;
        });
        //removes all but the latest prod release (to mimic old API behavior)
        game.releases =
          game.releases.length > 1 ? game.releases.slice(0, 1) : game.releases;

        game.releases = game.releases.map(release => {
          release.url = `${game.location}/${release.commitId}/${
            'true' == req.query.debug ? 'debug' : 'release'
          }/${'true' == req.query.archive ? '.zip' : 'index.html'}`;
          return release;
        });
        return game;
      })
    )
    .then(data => res.send({ success: true, data }))
    .catch(err => {
      console.log(err), res.send({ success: false, data: [] });
    });
});

module.exports = router;
