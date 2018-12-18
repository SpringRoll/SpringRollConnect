import { Game, Group } from '../../db/entities';
import { getConnection } from 'typeorm';
import { validate } from 'class-validator';
import { zipWith } from 'lodash';
const async = require('async'),
  log = require('../../helpers/logger'),
  // Game = require('../../models/game'),
  User = require('../../models/user');

const GameRepository = getConnection().getMongoRepository(Game);

/**
 * Abstraction to handle the page errors
 * @param  {String|Array} errors Single or collection of errors
 */
function handleError(req, res, errors) {
  log.error(errors);
  if (Array.isArray(errors)) {
    req.flash('errors', errors);
  } else {
    req.flash('error', 'Unable to update the game: ' + errors);
  }
  res.redirect(req.originalUrl);
}

/**
 * Abstraction to render a page, takes care of all
 * of the access control and populate the page with
 * standard parameters
 * @param  {Object} req The express request object
 * @param {Object} res The express response object
 * @param {string} template The template to use
 * @param {function} [success] Callback when completed
 */
function renderPage(req, res, template) {
  GameRepository.findOne({
    where: {
      slug: req.params.slug,
      groups: req.user.groups.map(group => group._id)
    }
  }).then(game => {
    // if no game found or user does not have access
    if (!game) {
      return res.status(404).render('404');
    }

    //Parse through the user's groups and get all their privilege levels
    const ids = game.groups.map(group => group.toString()).join('|');
    const reg = new RegExp(
      `(?:{(?:.|\\n)*?_id:\\s?(?:[${ids}])(?:.|\\n)*?privilege:\\s?(?<privilege>\\d)\\s?})+?`,
      'gm'
    );

    const str = req.user.groups.toString();
    // while ((m = reg.exec(str)) !== null) {
    //   console.log(m.groups.privilege | 0);
    // }
    let match;
    let permission = 0;
    while ((match = reg.exec(str))) {
      let p = Number(match.groups.privilege);
      if (permission < p) {
        permission = p;
      }
    }

    // console.log('game =>', game.groups.toString());

    res.render(template, {
      game: game,
      capabilities: game.capabilities,
      host: req.headers.host,
      isEditor: 0 < permission,
      isAdmin: 1 < permission,
      // token: access.token,
      errors: req.flash('errors'),
      success: req.flash('success'),
      error: req.flash('error')
    });
  });
}

/**
 * Abstraction to post a page, takes care of all
 * of the access control and populate the page with
 * standard parameters.
 * @param  {Object} req The express request object
 * @param {Object} res The express response object
 * @param {string} minPrivilege The minimum privilege needed to run all form
 * @param {Object} actions Run custom page actions
 */
function postPage(req, res, minPrivilege, actions) {
  // async.waterfall(
  //   [
  //     function(done) {
  //       Game.getBySlug(req.params.slug, done).populate('groups.group');
  //     },
  //     function(game, done) {
  //       if (!game) {
  //         return res.status(404).render('404');
  //       }
  //       game.getAccess(req.user, done);
  //     },
  //     function(game, access, done) {
  //       var response = function(err) {
  //         if (err) {
  //           return done(err);
  //         }
  //         done(null, game);
  //         return;
  //       };
  //       if (access.permission < minPrivilege) {
  //         return done('Invalid form permissions');
  //       }
  //       if (!req.body.action || !actions[req.body.action]) {
  //         done('Invalid form action');
  //       }
  //       actions[req.body.action](response, game, access);
  //     }
  //   ],
  //   function(err, game) {
  //     if (err) {
  //       return handleError(req, res, err);
  //     }
  //     req.flash('success', game.title + ' updated successfully');
  //     res.redirect(
  //       req.body.slug ? req.baseUrl + `/${req.body.slug}` : req.originalUrl
  //     );
  //   }
  // );
}

function defaultCapabilities(capabilities) {
  capabilities.ui = Object.assign(
    {
      mouse: false,
      touch: false
    },
    capabilities.ui
  );

  capabilities.sizes = Object.assign(
    {
      xsmall: false,
      small: false,
      medium: false,
      large: false,
      xlarge: false
    },
    capabilities.sizes
  );
}

module.exports = {
  renderPage,
  postPage,
  defaultCapabilities,
  handleError
};
