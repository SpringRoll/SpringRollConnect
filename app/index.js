#!/usr/bin/env node

// Include libraries
var express = require('express'),
	colors = require('colors'),
	expressValidator = require('express-validator'),
	errorHandler = require('errorhandler'),
	bodyParser = require('body-parser'),
    dotenv = require('dotenv'),
	flash = require('connect-flash');
// Load the environment file
dotenv.load();

// Create sever
var app = express();

// Get the configuration
var config = require('./config/environment.js')[app.get('env')];

// Change the working directory to here
process.chdir(__dirname);

// Setup the app
var port = process.env.PORT || 3000;
app.listen(port);
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(flash);
app.use(bodyParser.json());
app.set('json spaces', config.spaces);

// Set the version
app.set('version', require('../package.json').version);

// Custom validators
app.use(expressValidator(
{
	customValidators: require('./helpers/validators')
}));

// Rendering engine for mark-up
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// Expose the "public" folder
app.use(express.static(__dirname + '/public'));

// Setup the error handler
app.use(errorHandler(config.errorHandlerOptions));

// Start the server
console.log(('SpringRoll API running on http://localhost:' + port).green);

if (!process.env.MONGO_DATABASE)
{
	app.use(require('./routes/install'));
}
else
{
	// bootstrap the database connection
	require('./helpers/database')(app);
}
