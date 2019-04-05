#!/usr/bin/env node
// Include libraries
import connectToDB from './db/connect';
import { BootstrapPassport } from './helpers/passport';
import * as express from 'express';
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');

connectToDB.then(() => {
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

  BootstrapPassport(app);
});
