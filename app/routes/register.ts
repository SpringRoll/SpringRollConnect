import { getRepository } from 'typeorm';
import { User } from '../db';
import { validate } from 'class-validator';

const router = require('express').Router();
const passport = require('passport');

router.get('/', function(req, res) {
  res.render('register', {
    error: req.flash('error')
  });
});

router.post(
  '/',
  async function(req, res, next) {
    const userRepo = getRepository(User);

    const user = userRepo.create(req.body);

    const errors = await validate(user, { skipMissingProperties: true });

    if (errors.length) {
      return res.render('register', {
        errors: errors
      });
    }

    // await userRepo.save(user);

    // Make sure that someone can override
    // the user default privilege, would be
    // ugly to expose edit of this to anonymous
    // users to the site
    // req.body.privilege = 0;
    next();
  },
  passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
  })
);

module.exports = router;
