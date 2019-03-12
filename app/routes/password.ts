import { Router } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../db/entities';
import { compareSync } from 'bcrypt-nodejs';
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

  getRepository(User)
    .findByIds([user.id], { select: ['password'] })
    .then(([{ password }]) => {
      if (!compareSync(req.body.oldPassword, password)) {
        req.flash('success', 'yo dawg!');
        res.redirect(req.originalUrl);
        return;
      } else {
        req.flash('success', 'YOU FAIL');
        res.redirect(req.originalUrl);
      }
    });

  // if (!req.user.comparePassword(req.body.oldPassword)) {
  //   errors.push({ msg: 'Current password is invalid.' });
  // }

  // if (errors.length) {
  //   // render(res, errors);
  //   return;
  // }

  // req.user.password = req.body.newPassword;

  // req.user.save(function(err, user) {
  // req.flash('success', 'Password updated!');
  // res.redirect(req.originalUrl);
  // });
});

function render(res, errors, success) {
  if (typeof errors == 'string') {
    errors = [{ msg: errors }];
  }
  res.render('password', {
    errors: errors || [],
    success: success || null
  });
}

module.exports = router;
