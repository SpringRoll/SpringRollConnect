var router = require('express').Router();
var Group = require('../models/group');
var log = require('../helpers/logger');
var Pagination = require('../helpers/pagination');
import { getRepository } from 'typeorm';
import { Game, GroupPermission, User } from '../db';

router.get('/:local(page)?/:number([0-9]+)?', function(req, res) {
  if (req.isAuthenticated()) {
    const user: User = req.user;
    getRepository(GroupPermission)
      .find({
        cache: true,
        where: user.groups.map(({ id }) => ({ group: id })),
        select: ['game']
      })
      .then(gameIds =>
        getRepository(Game).find({
          cache: true,
          take: 12,
          where: gameIds.map(({ game }) => ({ id: game })),
          relations: ['releases'],
          order: {
            updated: 'DESC'
          }
        })
      )
      .then(games => {
        res.render('home', {
          games,
          groups: user.groups.filter(group => !group.isUserGroup)
        });
      })
      .catch(err => {
        log(err);
        res.render('home', {
          games: [],
          groups: user.groups.filter(group => !group.isUserGroup)
        });
      });
  } else {
    res.render('login', {
      error: req.flash('error'),
      redirect: req.flash('redirect')
    });
  }
});

router.post('/', function(req, res) {
  console.log(req.body);
  Group.findById(req.body.group, function(err, group) {
    if (err) {
      log.error('Unable to change personal token');
      log.error(err);
      req.flash('error', 'Something went wrong');
      res.redirect('/');
    } else if (!group) {
      req.flash('error', 'Unable to get user group');
      res.redirect('/');
    } else {
      group.refreshToken(function(err, group) {
        if (err) {
          req.flash('error', 'Unable to refresh token');
        } else {
          req.flash('success', 'Access token has been refreshed');
        }
        res.redirect('/');
      });
    }
  });
});

module.exports = router;
