import { Router } from 'express';
import { Release, Group, Game } from '../../db';
import { getRepository, In } from 'typeorm';

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
  (req.query.token
    ? getRepository(Group)
        .findOne({ token: req.query.token })
        .then(group => group.getPermittedGameIds())
        .then(uuids =>
          0 < uuids.length
            ? getRepository(Game).find({
                where: { uuid: In(uuids) },
                order: { updated: 'DESC' },
                relations: ['releases']
              })
            : []
        )
    : getRepository(Game)
        .createQueryBuilder('game')
        .leftJoinAndSelect('game.releases', 'release')
        .where(`release.status = 'prod'`)
        .orderBy('game.updated', 'DESC')
        .getMany()
  )
    .then(games =>
      games.map(game => {
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
    .catch(err => (console.log(err), res.send({ success: false, data: [] })));
});

module.exports = router;
