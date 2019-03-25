// var router = require('express').Router(),
import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Group, GroupPermission } from '../../db';
import { user as User, permissions } from '../../helpers';
const router = Router();
// const Group = require('../../models/group');
const Game = require('../../models/game');
// const User = require('../../models/user');

router.get('/:slug', function(req, res) {
  // return res.status(404).render('404');
  getRepository(Group)
    .findOne({ where: { slug: req.params.slug }, relations: ['users'] })
    .then(({ id, users, ...group }) => {
      const user = User(req);
      console.log(group);

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

// router.post('/:slug', access.isAdmin, function(req, res) {
//   var action = req.body.action;

//   async.waterfall(
//     [
//       function(done) {
//         Group.getBySlug(req.params.slug, false, done);
//       },
//       function(group, done) {
//         if (!group) {
//           return res.status(404).render('404');
//         }

//         switch (action) {
//           case 'refreshToken': {
//             group.refreshToken(function(err, group) {
//               done(err, 'Access token has been refreshed');
//             });
//             break;
//           }
//           case 'addUsers': {
//             var users = req.body.user;
//             if (!users) done('No users to add');

//             User.addGroup(users, group._id, function(err) {
//               done(err, 'User(s) added to ' + group.name);
//             });
//             break;
//           }
//           case 'addGames': {
//             var games = req.body.game;
//             if (!games) done('No games to add');

//             Game.addGroup(games, group._id, req.body.permission, function(err) {
//               done(err, 'Game(s) added to ' + group.name);
//             });
//             break;
//           }
//           case 'removeGame': {
//             Game.removeGroup(req.body.game, group._id, function(err) {
//               done(err, 'Game remove from ' + group.name);
//             });
//             break;
//           }
//           case 'removeUser': {
//             User.removeGroup(req.body.user, group._id, function(err) {
//               done(err, 'User removed from ' + group.name);
//             });
//             break;
//           }
//           case 'deleteGroup': {
//             // Remove reference to group from game
//             Game.removeGroup(null, group._id, function(err) {
//               if (err) {
//                 done(err);
//                 return;
//               }
//               // Remove the group
//               group.remove(function(err) {
//                 req.flash(
//                   'success',
//                   'Deleted ' + group.name + ' successfully.'
//                 );
//                 res.redirect('/groups');
//               });
//             });
//             break;
//           }
//           case 'updateGroup': {
//             req.checkBody('name', 'Name is required').notEmpty();
//             req.checkBody('slug', 'Slug is required').isSlug();
//             req.checkBody('privilege', 'Privilege must be valid').isInt();

//             var errors = req.validationErrors();

//             if (errors) {
//               req.flash('errors', errors);
//               render(group, req, res);
//             } else {
//               group.name = req.body.name;
//               group.slug = req.body.slug;
//               group.privilege = req.body.privilege;
//               group.logo = req.body.logo;

//               var expires = group.tokenExpires !== null;

//               // Only refresh the token if we change modes
//               if (!expires && req.body.tokenExpiresRefresh == '1')
//                 group.tokenExpires = Group.getTokenExpires();

//               if (req.body.tokenExpiresRefresh == '-1')
//                 group.tokenExpires = null;

//               group.save(function(err, group) {
//                 if (err) {
//                   done('Unable to update the group: ' + err);
//                 } else {
//                   done(err, 'Saved group!');
//                 }
//               });
//             }
//             break;
//           }
//           default: {
//             done('Invalid action');
//             break;
//           }
//         }
//       }
//     ],
//     function(err, result) {
//       if (err) {
//         req.flash('error', err);
//       } else {
//         req.flash('success', result);
//       }
//       res.redirect(req.originalUrl);
//     }
//   );
// });

module.exports = router;
