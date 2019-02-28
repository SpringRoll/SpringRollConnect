import { getRepository } from 'typeorm';
import { Config } from '../db';
var log = require('../helpers/logger');

module.exports = function(app) {
  const access = require('../helpers/access');
  const marky = require('marky-markdown');

  // Add the user to whatever template
  app.use(function(req, res, next) {
    res.locals.fullYear = new Date().getFullYear();
    res.locals.url = req.originalUrl;
    res.locals.user = req.user;
    res.locals.privilege = access.privilege;
    res.locals.moment = require('moment');
    res.locals.version = app.get('version');
    res.locals.marked = function(str) {
      return marky(str);
    };
    res.locals.isActive = function(url, undefined) {
      var isCurrent =
        url instanceof RegExp
          ? url.test(req.originalUrl)
          : url == req.originalUrl;
      return isCurrent ? 'active' : undefined;
    };
    next();
  });

  // Get the configuration
  app.use(async function(req, res, next) {
    global['CONFIGURATION'] =
      (await getRepository(Config).findOne({ cache: true })) || new Config();
    next();
  });

  app.use(function(req, res, next) {
    const route =
      (req.originalUrl.startsWith('/games') &&
        !req.originalUrl.endsWith('privileges')) ||
      req.originalUrl.startsWith('/archive') ||
      req.originalUrl.startsWith('/releases');
    const contents =
      req.body && typeof req.body === 'object' && 'action' in req.body;
    // if fails cases, can just pass through w/ no change
    if (route && contents) {
      // Map RESTORE keyword to PATCH action, w/ isArchived flag change
      if (req.body.action === 'RESTORE') {
        req.body.isArchived = false;
        req.method = 'PATCH';
      }
      // Set POST to PATCH / DELETE based on value in form
      else {
        req.method = req.body.action;
      }
    }
    next();
  });

  // Site pages
  app.use('/', require('./home'));
  // app.use('/embed', require('./embed'));
  // app.use('/docs', access.isAuthenticated, require('./docs'));
  // app.use('/games/add', access.isEditor, require('./games/add'));
  // app.use('/games/search', access.isAuthenticated, require('./games/search'));
  // app.use('/groups/add', access.isAdmin, require('./groups/add'));
  // app.use('/games', access.isAuthenticated, require('./games/index'));
  // app.use('/releases', access.isEditor, require('./releases/release'));
  // app.use('/archive', access.isEditor, require('./games/index'));
  // app.use('/groups/group', access.isAuthenticated, require('./groups/group'));
  // app.use('/groups/search', access.isAdmin, require('./groups/search'));
  // app.use('/groups', access.isAdmin, require('./groups/index'));
  // app.use('/users/search', require('./users/search'));
  // app.use('/users/add', access.isAdmin, require('./users/add'));
  // app.use('/users', access.isAdmin, require('./users/index'));
  // app.use('/configuration', access.isAdmin, require('./configuration'));

  // RESTful service for releases
  // app.use('/api/release', require('./api/release'));
  // app.use('/api/releases', require('./api/releases'));
  // app.use('/api/games', require('./api/games'));
  // Authentication Pages
  app.use('/login', access.isAnonymous, require('./login'));
  app.use('/logout', access.isAuthenticated, require('./logout'));
  app.use('/register', access.isAnonymous, require('./register'));
  app.use('/forgot', access.isAnonymous, require('./forgot'));
  app.use('/reset', access.isAnonymous, require('./reset'));
  app.use('/profile', access.isAuthenticated, require('./profile'));
  app.use('/password', access.isAuthenticated, require('./password'));

  // All other pages default to 404
  app.all('*', function(req, res) {
    res.status(404).render('404');
  });

  // Setup the error handler. Note that this code is declared AFTER all of the other routes as per the recommendation
  // here: https://stackoverflow.com/a/32671421/10200077
  app.use(function(err, req, res, next) {
    // log the error occurring
    log.error('Uncaught error');
    log.error(err);

    // only show the stack when we're not in production
    const showStack = process.env.NODE_ENV !== 'production';

    // if it's an ajax request, respond with JSON
    if (req.xhr) {
      const response = {
        success: false,
        message: err.toString()
      };

      if (showStack) {
        //@ts-ignore
        response.stack = err.stack;
      }

      res.status(500).send(response);
    } else {
      // Otherwise, render our 500 view which renders the same info, but as HTML
      res.status(500).render('500', { err, showStack });
    }
  });
};
