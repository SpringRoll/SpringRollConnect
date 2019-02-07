const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const mongooseTypes = require('mongoose-types');

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

  static async connect() {
    if (fs.existsSync('.env')) {
      dotenv.load();
    }
    return mongoose
      .connect(process.env.MONGO_DATABASE, { useMongoClient: true })
      .then(() => {
        mongooseTypes.loadTypes(mongoose);
        this.connection.on('error', err => {
          console.error(err);
        });
      })
      .catch(err => console.error(err));
  }
}
