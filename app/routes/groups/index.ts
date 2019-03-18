import { getRepository } from 'typeorm';
import { Group } from '../../db';
import { pagination } from '../../helpers';
import { Router } from 'express';

module.exports = Router().get('/:local(page)?/:number([0-9]+)?', (req, res) =>
  getRepository(Group)
    .findAndCount({
      cache: true,
      order: { name: 'ASC' },
      skip: 1 < req.params.number ? (req.params.number - 1) * 24 : 0,
      take: 24,
      where: { isUserGroup: false }
    })
    .then(([groups, count]) =>
      res.render('groups/index', {
        groups,
        pagination: pagination(count, req.params.number, '/groups'),
        error: req.flash('error'),
        errors: req.flash('errors'),
        success: req.flash('success')
      })
    )
);
