#!/usr/bin/env node
// Include libraries
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import connect from './db/connect';
import 'colors';

require('colors');
const expressValidator = require('express-validator');
const errorHandler = require('errorhandler');

async function start() {
  if (fs.existsSync('.env')) {
    // Load the environment file
    dotenv.load();
  }
  await connect;

  // Create sever
  const app = express();

  // Get the configuration
  const config = require('./config/environment.js')[app.get('env')];

  // Change the working directory to here
  process.chdir(__dirname);

  // Setup the app
  const port = process.env['PORT'] || 3000;
  app.listen(port);
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json());
  app.set('json spaces', config.spaces);

  // Set the version
  app.set('version', require('../package.json').version);

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

  // Setup the error handler
  app.use(errorHandler(config.errorHandlerOptions));

  // Start the server
  console.log(('SpringRoll API running on http://localhost:' + port).green);

  if (!process.env['MONGO_DATABASE']) {
    app.use(require('./routes/install'));
  } else {
    // bootstrap the database connection
    require('./helpers/database')(app);
  }
}
start();
