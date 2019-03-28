const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const mongooseTypes = require('mongoose-types');
mongoose.Promise = Promise;

/**
 * @typedef {object} Models
 * @property {Game} Models.Game
 * @property {User} Models.User
 * @property {Group} Models.Group
 * @property {Release} Models.Release
 */

export class Database {
  static get connection() {
    return mongoose.connection;
  }

  static async connect(done = (...args) => {}) {
    if (fs.existsSync('.env')) {
      dotenv.load();
    }
    return mongoose.connect(
      process.env.MONGO_DATABASE,
      { useMongoClient: true },
      () => {
        mongooseTypes.loadTypes(mongoose);
        this.connection.on('error', err => {
          console.error(err);
        });
        done(mongoose.connection);
      }
    );
  }
}
