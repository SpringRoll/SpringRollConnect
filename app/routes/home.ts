import { getRepository } from 'typeorm';
import { Release } from '../db';
import { Request, Response, Router } from 'express';
import { pagination } from '../helpers';
import { user } from '../helpers';
import { log } from '../helpers/logger';

const router = Router();

router.get('/:local(page)?/:number([1-9][0-9]?*)?', function(
  req: Request,
  res: Response
) {
  if (!req.isAuthenticated()) {
    return res.render('login', {
      error: req.flash('error'),
      redirect: req.flash('redirect')
    });
  }

  user(req)
    .getPermittedGameIds()
    .then(gameIds => {
      if (1 > gameIds.length) {
        return [[], 0];
      }

      return getRepository(Release)
        .createQueryBuilder('release')
        .select([
          'MAX(release.updated) as latest',
          'release.gameUuid',
          'COUNT (release.gameUuid) as count'
        ])
        .leftJoinAndSelect('release.game', 'game')
        .addSelect(['game.thumbnail'])
        .groupBy('release.gameUuid')
        .addGroupBy('game.uuid')
        .orderBy('latest', 'DESC')
        .limit(24)
        .offset(req.params.number ? Number(req.params.number) * 24 : 0)
        .where('release.gameUuid IN (:...games)', { games: gameIds })
        .getRawMany()
        .then(games => [
          games.map(({ game_slug, game_title, game_thumbnail, count }) => ({
            slug: game_slug,
            title: game_title,
            thumbnail: game_thumbnail,
            releaseCount: count
          })),
          gameIds.length
        ]);
    })
    .then(([games, count]) =>
      res.render('home', {
        games: games,
        groups: req.user.groups,
        pagination: pagination(count, req.params.number)
      })
    )
    .catch(err =>
      res.render('home', {
        games: [],
        groups: req.user.groups
      })
    );
});

router.post('/', (req: Request, res: Response) =>
  user(req)
    .groups.find(({ isUserGroup }) => isUserGroup)
    .refreshToken()
    .catch(err => {
      log.error('Unable to change personal token');
      log.error(err);
      req.flash('error', 'Something went wrong');
    })
    .finally(() => res.redirect('/'))
);

module.exports = router;
