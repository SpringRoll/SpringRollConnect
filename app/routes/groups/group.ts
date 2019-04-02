import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Group, GroupPermission } from '../../db';
import { user as User, permissions, isAdmin } from '../../helpers';
import * as groupMethods from './groupMethods';

const router = Router();

router.get('/:slug', function(req, res) {
  // return res.status(404).render('404');
  getRepository(Group)
    .findOne({ where: { slug: req.params.slug }, relations: ['users'] })
    .then(({ id, users, ...group }) => {
      const user = User(req);

      if (!group) {
        return res.status(404).render('404');
      } else if (
        !req.user.isAdmin &&
        !users.find(({ id }) => req.user.id === id)
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
  // Group.getBySlug(req.params.slug, false, function(err, group) {
  //   if (!group) {
  //     return res.status(404).render('404');
  //   }

  //   if (req.user.privilege < privilege.admin && !req.user.inGroup(group)) {
  //     return res.status(401).render('401');
  //   }

  //   res.render('groups/group', {
  //     success: req.flash('success'),
  //     error: req.flash('error'),
  //     group: group,
  //     games: Game.getGamesByGroup(group)
  //       .select('title slug isArchived groups')
  //       .sort('title'),
  //     users: User.getByGroup(group).select('name')
  //   });
  // });
});

router.post('/:slug', isAdmin, function(req, res) {
  const { action } = req.body;

  if ('function' === typeof groupMethods[action]) {
    return groupMethods[action](req, res, req.body);
  }

  res.redirect(req.originalUrl);
});

module.exports = router;
