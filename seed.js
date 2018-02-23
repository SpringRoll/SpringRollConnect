// Load Environment
var dotenv = require('dotenv');
dotenv.load();
process.env.MONGO_DATABASE = 'mongodb://localhost:27017/connect';

var app = require('express')();

// stub out the schema
require('./app/helpers/database')(app);

// create an admin user
var access = require('./app/helpers/access');
var User = require('./app/models/user');

console.log('Creating admin user...');
User.createUser(
  {
    username: 'admin',
    password: 'password',
    email: 'empty@email.com',
    name: 'Admin'
  }, 
  access.privilege.admin,
  function(err, user)
  {
    console.log('Done!');
    if (err) {
      throw err;
      process.exit(1)
    }

    process.exit(0);
  }
);
