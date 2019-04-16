import { Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../db/entities';
import { compareSync, hash, genSalt } from 'bcryptjs';
const router = Router();

router.get('/', function(req, res) {
  res.render('password', {
    errors: [],
    success: req.flash('success')
  });
});

router.post('/', function(req: any, res) {
  const errors = [];
  if (!req.body.oldPassword) {
    errors.push('Current Password is required.');
  }

  if (!req.body.newPassword) {
    errors.push('New Password is required.');
  }

  if (req.body.oldPassword !== req.body.newPassword) {
    errors.push('Repeat Password must be equal to New Password.');
  }

  if (0 !== errors.length) {
    return res.render('password', { errors });
  }

  const userRepository = getRepository(User);

  userRepository
    .findOne(req.user.id, { select: ['password'] })
    .then(({ password }) => {
      if (!compareSync(req.body.oldPassword, password)) {
        return res.render('password', {
          error: 'Current password is invalid.'
        });
      }

      genSalt(10, (_, salt) =>
        hash(req.body.newPassword, salt, (_, hashed) =>
          userRepository
            .update(req.user.id, { password: hashed })
            .catch(err =>
              res.render('password', {
                error: 'An error occurred while updating your password'
              })
            )
            .then(() => res.render('login', { success: 'Password updated!' }))
        )
      );
    });
});
module.exports = router;
