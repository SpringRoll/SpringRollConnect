import { getRepository, Like } from 'typeorm';
import { Router } from 'express';
import { User } from '../../db';

module.exports = Router().post('/', function(req, res) {
  let where;
  if (req.body.username) {
    where = { username: req.body.username };
  } else if (req.user && req.body.search) {
    where = { name: Like(`%${req.body.search}%`) };
  } else if (req.body.email) {
    where = { email: req.body.email };
  } else {
    return res.send({});
  }

  getRepository(User)
    .findOne({ select: ['name'], where })
    .then(user => res.send(user))
    .catch(err => res.send({}));
});
