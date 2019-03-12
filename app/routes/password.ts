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
  req.checkBody('oldPassword', 'Current Password is required.').notEmpty();
  req.checkBody('newPassword', 'New Password is required.').notEmpty();
  req
    .checkBody(
      'repeatPassword',
      'Repeat Password must be equal to New Password.'
    )
    .equals(req.body.newPassword);

  var errors = req.validationErrors() || [];

  const { user }: { user: User } = req;

  if (0 !== errors.length) {
    return res.render('password', { errors });
  }

  const userRepo = getRepository(User);

  userRepo
    .findByIds([user.id], { select: ['password'] })
    .then(([{ password }]) => {
      if (!compareSync(req.body.oldPassword, password)) {
        return res.render('password', {
          error: 'Current password is invalid.'
        });
      }

      genSalt(10, (_, salt) =>
        hash(req.body.newPassword, salt, (_, hashed) =>
          userRepo
            .update(user.id, { password: hashed })
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
