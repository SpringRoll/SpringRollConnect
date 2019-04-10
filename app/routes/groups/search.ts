import { Router } from 'express';
import { getRepository, Like } from 'typeorm';
import { Group } from '../../db';

module.exports = Router().post('/', (req, res) =>
  req.body.slug
    ? getRepository(Group)
        .find({ slug: Like(req.body.slug) })
        .then(groups => res.send(groups))
    : getRepository(Group)
        .createQueryBuilder('group')
        .where('LOWER(group.name) LIKE :search', {
          search: `%${req.body.search.toLowerCase()}%`
        })
        .getMany()
        .then(groups => res.send(groups))
);
