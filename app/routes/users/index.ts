import { Router } from 'express';
import { User } from '../../db';
import { getRepository } from 'typeorm';

const router = Router();

router.post('/', function(req, res) {
  const userRepository = getRepository(User);
  switch (req.body.action) {
    case 'save':
      return userRepository
        .findOne({
          where: { username: req.body.username }
        })
        .then(async user => {
          const {
            privilege,
            active,
            password,
            confirm,
            userId,
            ...update
          } = req.body;

          user = userRepository.merge(user, update);

          user.active = 'true' == active;
          if (password && confirm && confirm === password) {
            await user.hashPassword(password);
          }

          user.groups = user.groups.map(group => {
            if (group.isUserGroup) {
              group.privilege = privilege;
            }

            return group;
          });

          return userRepository.save(user);
        })
        .finally(() => res.redirect('/users'));

    //TODO: add delete
    //     else if (action == 'delete') {
    //       // Delete the user-group
    //       user.groups[0].remove();

    //       // Remove the user
    //       user.remove(function(err) {
    //         req.flash('success', 'Deleted ' + user.name + ' successfully.');
    //         res.redirect('/users');
    //       });
    //     } else {
    //       render(user, req, res);
    //     }
    default:
      return userRepository
        .findOne({ where: { username: req.body.userId } })
        .then(user => {
          render(user, req, res);
        })
        .catch(err => res.send({}));
  }
});

function render(user, req, res) {
  return res.render('users/edit', {
    editUser: user,
    error: req.flash('error'),
    errors: req.flash('errors'),
    success: req.flash('success')
  });
}

router.get('/', (req, res) => {
  getRepository(User)
    .find({ select: ['name', 'username'], order: { name: 'ASC' } })
    .then(users => {
      res.render('users/index', {
        users,
        error: req.flash('error'),
        errors: req.flash('errors'),
        success: req.flash('success')
      });
    });
});

module.exports = router;
