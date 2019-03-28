import { user } from '../../helpers';
import { Like, getRepository, In } from 'typeorm';
import { Router } from 'express';
import { Game } from '../../db';

module.exports = Router().post('/', (req, res) => {
  let where;
  if (req.body.slug) {
    where = { slug: req.body.slug };
  } else if (req.body.bundleId) {
    where = { bundleId: req.body.bundleId };
  } else if (req.body.search) {
    where = { title: Like(`%${req.body.search}%`) };
  } else {
    return res.send([]);
  }
  user(req)
    .getPermittedGameIds()
    .then(gameIds =>
      getRepository(Game).findAndCount({
        where: {
          uuid: In(gameIds),
          ...where
        }
      })
    )
    .then(([games]) =>
      res.send(
        games.map(({ title, isArchived, slug }) => ({
          slug,
          title,
          url: isArchived ? '/archive/' : '/games/'
        }))
      )
    );
});
