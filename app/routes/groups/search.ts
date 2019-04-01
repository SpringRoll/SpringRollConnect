import { Router } from 'express';
import {} from 'typeorm';
import { Group } from '../../db';
const router = Router();

module.exports = Router().post('/', function(req, res) {
  //TOD0: Re-implement search
  // if (req.body.slug) {
  //   res.send(
  //     Group.getBySlug(req.body.slug, req.body.isUserGroup || null).select(
  //       'slug'
  //     )
  //   );
  // } else if (req.body.search) {
  //   res.send(Group.getBySearch(req.body.search, 10));
  // }
});
