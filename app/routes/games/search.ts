import { user } from '../../helpers';
import { Like, getRepository, In } from 'typeorm';
import { Router } from 'express';
import { Game } from '../../db';

module.exports = Router().post('/', (req, res) => {
  let argument;
  let query;
  if (req.body.slug) {
    query = 'game.slug = :slug';
    argument = { slug: req.body.slug };
  } else if (req.body.bundleId) {
    query = 'game.bundleId = :bundleId';
    argument = { bundleId: req.body.bundleId };
  } else if (req.body.search) {
    query = 'LOWER(game.title) LIKE :title';
    argument = { title: `%${req.body.search.toLowerCase()}%` };
  } else {
    return res.send([]);
  }
  user(req)
    .getPermittedGameIds()
    .then(gameIds =>
      getRepository(Game)
        .createQueryBuilder('game')
        .whereInIds(gameIds)
        .andWhere(query, argument)
        .getMany()
    )
    .then(games =>
      res.send(
        games.map(({ title, isArchived, slug }) => ({
          slug,
          title,
          url: isArchived ? '/archive/' : '/games/'
        }))
      )
    );
});
