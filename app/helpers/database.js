var mongoose = require('mongoose'),
  mongooseTypes = require('mongoose-types'),
  session = require('express-session'),
  log = require('./logger'),
  MongoDBStore = require('connect-mongodb-session')(session);

const notForApi = function(callback) {
  return function(req, res, next) {
    if (req.path.indexOf('/api') === 0) {
      next();
    } else {
      callback(req, res, next);
    }
  };
};

// Database connection bootstrap
module.exports = function(app) {
  log.info('Springroll API is now operational');

  // if we're spawned in a child process, notify any listeners
  if (process.send) {
    process.send({ message: 'Springroll API is now operational' });
  }

  // Attempt to connect to database
  mongoose.connect(process.env.MONGO_DATABASE, function() {
    // Include models once
    require('../models/release');
    require('../models/game');
    require('../models/group');
    require('../models/user');
  });

  // Load the types for URL and Email
  mongooseTypes.loadTypes(mongoose);

  // Listen for errors
  var db = mongoose.connection;
  db.on('error', function(err) {
    log.error('Database connection error');
    log.error(err);
  });

  var store = new MongoDBStore({
    uri: process.env.MONGO_DATABASE,
    collection: 'auth_sessions'
  });
};
