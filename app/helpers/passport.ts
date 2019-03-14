const passport = require('passport');
const routes = require('../routes');
const flash = require('connect-flash');
const session = require('express-session');

export const BootstrapPassport = app => {
  const notForApi = function(callback) {
    return function(req, res, next) {
      if (req.path.indexOf('/api') === 0) {
        next();
      } else {
        callback(req, res, next);
      }
    };
  };

  // Authentication stuff
  app.use(
    notForApi(
      session({
        secret: process.env.SECRET_KEY,
        saveUninitialized: true,
        resave: true
      })
    )
  );
  app.use(notForApi(flash()));
  app.use(notForApi(passport.initialize()));
  app.use(notForApi(passport.session()));
  require('./auth')(passport);

  // Load all the routes
  routes(app);
};
