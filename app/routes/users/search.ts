import { getRepository, Like } from 'typeorm';
import { Router } from 'express';
import { User } from '../../db';

module.exports = Router().post('/', function(req, res) {
  let where;
  let param;
  const query = getRepository(User).createQueryBuilder('user');

  if (req.body.username) {
    where = 'LOWER(user.username) LIKE :username';
    param = { username: `${req.body.username.toLowerCase()}%` };
  } else if (req.user && req.body.search) {
    where = 'LOWER(user.name) LIKE :name';
    param = { name: `${req.body.search.toLowerCase()}%` };
  } else if (req.body.email) {
    where = 'LOWER(user.email) LIKE :email';
    param = { email: `%${req.body.email.toLowerCase()}%` };
  } else {
    return res.send({});
  }

  return query
    .select(['user.id', 'user.name'])
    .where(where, param)
    .getMany()
    .then(user => res.send(user))
    .catch(err => res.send({}));
});
