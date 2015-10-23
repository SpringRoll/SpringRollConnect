var mongoose = require('mongoose'),
	mongooseTypes = require('mongoose-types'),
	expressMongoose = require('express-mongoose'),
	passport = require('passport'),
	routes = require('../routes'),
	flash = require('connect-flash'),
	session = require('express-session'),
	log = require('./logger');
    MongoDBStore = require('connect-mongodb-session')(session);
// Database connection bootstrap
module.exports = function(app)
{
	log.info('Springroll API is now operational');

	// Attempt to connect to database
	mongoose.connect(process.env.MONGO_DATABASE, function()
	{
		// Include models once
		require('../models/release');
		require('../models/game');
		require('../models/group');
		require('../models/user');
	});

	// Load the types for URL and Email
	mongooseTypes.loadTypes(mongoose);

	// Listen for errors
	var db = mongoose.connection;
	db.on('error', function(err)
	{
		console.error(String("Connection error : " + err).red);
	});
    
    var store = new MongoDBStore(
        {
            uri: process.env.MONGO_DATABASE,
            collection: 'auth_sessions'
        }
    );

    store.on('error', function(error) {
        assert.ifError(error);
        assert.ok(false);
    });
	// Authentication stuff
	app.use(session(
	{
		secret: process.env.SECRET_KEY,
		saveUninitialized: true,
		resave: true,
        store: store
                                       
	}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	require('./auth')(passport);

	// Load all the routes
	routes(app);
};
