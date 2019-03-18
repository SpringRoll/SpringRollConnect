import { Router } from 'express';
import { User } from '../../db';
import { getRepository } from 'typeorm';
const UserRepo = getRepository(User);

const router = Router();

router.post('/', function(req, res) {
  UserRepo.findOne({ where: { username: req.body.userId } })
    .then(user => {
      render(user, req, res);
    })
    .catch(err => res.send({}));
});
//   var action = req.body.action;

//   User.getById(req.body.userId, function(err, user) {
//     // Invalid user id
//     if (!user) {
//       req.flash('error', 'User is invalid');
//       return res.redirect('/users');
//     }

//     // Update the user
//     if (action == 'save') {
//       var pass = req.body.password;

//       req.checkBody('name', 'Name is required').notEmpty();
//       req
//         .checkBody('username', 'Username must only be alpha characters')
//         .isAlpha();
//       req.checkBody('email', 'Email must be a valid email address').isEmail();
//       req.checkBody('privilege', 'Privilege must be valid').isInt();

//       if (pass) {
//         req
//           .checkBody('confirm', 'Password and confirm password do not match')
//           .equals(pass);
//       }
//       var errors = req.validationErrors();

//       if (errors) {
//         req.flash('errors', errors);
//         render(user, req, res);
//       } else {
//         user.name = req.body.name;
//         user.username = req.body.username;
//         user.email = req.body.email;
//         user.active = !!req.body.active;

//         // Update the password, saving with hash
//         if (pass) user.password = req.body.password;

//         var userGroup = user.groups[0];

//         // Update the global user privilege
//         userGroup.name = req.body.name;
//         userGroup.privilege = req.body.privilege;

//         // Save the group
//         userGroup.save(function(err) {
//           if (err) {
//             log.error(err);
//             req.flash('error', 'Unable to update the user');
//             return render(user, req, res);
//           }

//           user.save(function(err) {
//             if (err) {
//               log.error(err);
//               req.flash('error', 'Unable to update the user');
//             } else {
//               req.flash('success', 'Saved user!');
//             }
//             render(user, req, res);
//           });
//         });
//       }
//     }
//     // delete the user
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
//   });
// });

function render(user, req, res) {
  return res.render('users/edit', {
    editUser: user,
    error: req.flash('error'),
    errors: req.flash('errors'),
    success: req.flash('success')
  });
}

router.get('/', (req, res) => {
  UserRepo.find({ select: ['name', 'username'], order: { name: 'ASC' } }).then(
    users => {
      res.render('users/index', {
        users,
        error: req.flash('error'),
        errors: req.flash('errors'),
        success: req.flash('success')
      });
    }
  );
});

module.exports = router;
