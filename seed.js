// Load Environment
var dotenv = require('dotenv');
dotenv.load();
process.env.MONGO_DATABASE = 'mongodb://localhost:27017/connect';
process.env.OUTPUT_LOG = './log.txt';

// create a password
var crypto = require('crypto');
var password = ''
crypto.randomBytes(16).forEach(value => {
  password += (value % 16).toString(16);
})

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
    password: password,
    email: 'empty@email.com',
    name: 'Admin'
  }, 
  access.privilege.admin,
  function(err, user)
  {
    if (err) {
      throw err;
      process.exit(1)
    }

    console.log(`User admin created with password ${password}`);
    process.exit(0);
  }
);
