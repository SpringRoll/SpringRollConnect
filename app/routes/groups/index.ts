import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Group, GroupPermission, User as DBUser } from '../../db';
import { user as User, permissions, isAdmin } from '../../helpers';
import * as groupMethods from './groupMethods';
import { pagination } from '../../helpers';

const router = Router();

router.get('/:local(page)?/:number([0-9]+)?', (req, res) =>
  getRepository(Group)
    .findAndCount({
      cache: true,
      order: { name: 'ASC' },
      skip: 1 < +req.params.number ? (+req.params.number - 1) * 24 : 0,
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

router.get('/:slug', function(req, res) {
  console.log('INSIDE GET/slug');
  getRepository(Group)
    .findOne({ where: { slug: req.params.slug }, relations: ['users'] })
    .then(({ id, users, ...group }) => {
      const user = User(req);

      if (!group) {
        return res.status(404).render('404');
      } else if (
        !(<DBUser>req.user).isAdmin &&
        !users.find(({ id }) => (<DBUser>req.user).id === id)
      ) {
        return res.status(401).render('401');
      }

      getRepository(GroupPermission)
        .find({
          where: { groupID: id },
          relations: ['game']
        })
        .then(permissions => {
          res.render('groups/group', {
            error: req.flash('error'),
            games: permissions.map(({ game, permission }) => {
              (<any>game).permission = permission;
              return game;
            }),
            group,
            success: req.flash('success'),
            users
          });
        });
    });
});


router.post('/:slug', isAdmin, function(req, res) {
  const { action } = req.body;
  if ('function' === typeof groupMethods[action]) {
    return groupMethods[action](req, res, req.body);
  }
});

module.exports = router;

