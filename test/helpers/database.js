const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const mongooseTypes = require('mongoose-types');

const database = {
  /**
   * Initialize the database testing harness
   * @return Promise A promise that resolves once the database connection has been made
   */
  init: () => {
    // don't load the database twice
    if(database.models !== undefined) {
      return Promise.resolve();
    }

    if(fs.existsSync('.env')) {
      dotenv.load();
    }

    return new Promise((resolve, reject) => {

      database.models = {};

      mongoose.connect(process.env.MONGO_DATABASE, function(err) {
        if(err) {
          reject(err);
          return;
        }

        database.connection = mongoose.connection;
        database.models.Release = require('../../app/models/release');
        database.models.Game = require('../../app/models/game');
        database.models.Group = require('../../app/models/group');
        database.models.User = require('../../app/models/user');
        
        // load extended Mongoose model types for email and URL
        mongooseTypes.loadTypes(mongoose);

        resolve();
      });

      mongoose.connection.on('error', function(err) {
        delete database.models;

        reject(err);
      });
    });
  },

  /**
   * An object with all of the database models (User, Release, Game, Group).
   * For instance, after init finishes, database.models.User is a reference to the user model
   */
  models: undefined,

  /**
   * A reference to the raw mongo database connection. Useful for manually closing the connection, or for raw queries
   */
  connection: undefined
};

module.exports = database;
