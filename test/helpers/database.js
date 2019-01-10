const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const mongooseTypes = require('mongoose-types');

const database = {
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
        database.models.release = require('../../app/models/release');
        database.models.game = require('../../app/models/game');
        database.models.group = require('../../app/models/group');
        database.models.user = require('../../app/models/user');
        
        // load extended Mongoose model types for email and URL
        mongooseTypes.loadTypes(mongoose);

        resolve();
      });

      mongoose.connection.on('error', function(err) {
        delete database.models;

        reject(err);
      });
    });
  }
};

module.exports = database;
