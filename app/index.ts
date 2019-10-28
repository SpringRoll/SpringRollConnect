#!/usr/bin/env node
// Include libraries
import { BootstrapPassport } from './helpers/passport';
import * as express from 'express';
import { exec } from 'child_process';
import { log } from './helpers/logger';
const bodyParser = require('body-parser');

// Create sever
var app = express();

// Change the working directory to here
process.chdir(__dirname);

// Setup the app
var port = process.env.PORT || 3000;
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

exec('git rev-list -n1 HEAD', (err, stdout, stderr) => {
  if (err) {
    log.error(err);
  } else {
    log.info('stdout', stdout);
    log.error('stderr', stderr);
    app.set('commitID', stdout);
  }
});

// Rendering engine for mark-up
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Expose the "public" folder
app.use(express.static(__dirname + '/public'));

BootstrapPassport(app);

module.exports = app.listen(port);
