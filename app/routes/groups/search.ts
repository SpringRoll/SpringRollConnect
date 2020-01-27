import { Router } from 'express';
import { getRepository, Like } from 'typeorm';
import { Group } from '../../db';

module.exports = Router().post('/', (req, res) => {
  if(req.body.slug){
    getRepository(Group)
        .find({ slug: req.body.slug })
        .then(groups => {
          if(groups.length !== 0){
            res.send(groups);
          } else {
            res.send(false);
          }
        })
  } else {
    res.send(false);
  }
});
