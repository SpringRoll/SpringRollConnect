import { Router } from 'express';
const passport = require('passport');
const router = Router();

router.post(
  '/',
  passport.authenticate('login', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => res.redirect(req.body.redirect || '/')
);

router.get('/', (req, res) =>
  res.render('login', {
    error: req.flash('error'),
    redirect: req.flash('redirect')
  })
);

module.exports = router;
