var router = require('express').Router();
import { getRepository, Any } from 'typeorm';
import { User } from '../db';
import { Request, Response } from 'express';
const log = require('../helpers/logger');

router.get('/:local(page)?/:number([1-9][0-9]?*)?', function(
  req: Request,
  res: Response
) {
  if (!req.isAuthenticated()) {
    res.render('login', {
      error: req.flash('error'),
      redirect: req.flash('redirect')
    });
  }

  getRepository(User)
    .create(<User>req.user)
    .getGames({
      skip: req.params.number ? Number(req.params.number) * 24 : 0
    })
    .then(([games, count]) => {
      if (1 > games.length && '/' !== req.url.trim()) {
        res.redirect('/');
        return;
      }
      res.render('home', {
        games,
        groups: req.user.groups,
        pagination: {
          total: count,
          current: Number(req.params.number) || 1
        }
      });
    })
    .catch(err => {
      res.render('home', {
        games: [],
        groups: Array.isArray(req.user.groups)
          ? req.user.groups.filter(group => !group.isUserGroup)
          : []
      });
    });
});

router.post('/', async function(req: Request, res: Response) {
  if (!req.isAuthenticated()) {
    res.render('login', {
      error: req.flash('error'),
      redirect: req.flash('redirect')
    });
    return;
  }
  const user = getRepository(User).create(<User>req.user);

  user.groups
    .find(({ isUserGroup }) => isUserGroup)
    .refreashToken()
    .then(() => {
      req.login(user, () => res.redirect('/'));
    })
    .catch(err => {
      log.error('Unable to change personal token');
      log.error(err);
      req.flash('error', 'Something went wrong');
      res.redirect('/');
    });
});

module.exports = router;
