#!/usr/bin/env node

// Include libraries
var express = require('express'),
  colors = require('colors'),
  expressValidator = require('express-validator'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  dotenv = require('dotenv'),
  { exec } = require('child_process');

if (fs.existsSync('.env')) {
  // Load the environment file
  dotenv.load();
}

// Create sever
var app = express();

// Change the working directory to here
process.chdir(__dirname);

// Setup the app
var port = process.env.PORT || 3000;
app.listen(port);
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

let spaces = 4;
if (process.env.NODE_ENV === 'production') {
  spaces = 0;
}
app.set('json spaces', spaces);

// Set the version
app.set('version', require('../package.json').version);

const log = require('./helpers/logger');
exec(`git rev-list -n1 HEAD`, (err, stdout, stderr) => {
  if (err) {
    log.error(err);
  } else {
    log.info(stdout);
    log.error(stderr);
    app.set('commitID', stdout);
  }
});

// Custom validators
app.use(
  expressValidator({
    customValidators: require('./helpers/validators')
  })
);

// Rendering engine for mark-up
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Expose the "public" folder
app.use(express.static(__dirname + '/public'));

if (!process.env.MONGO_DATABASE) {
  app.use(require('./routes/install'));
} else {
  // bootstrap the database connection
  require('./helpers/database')(app);
}
