var bunyan = require('bunyan');
var log = bunyan.createLogger({
	name: 'springroll-deployment',
	streams: [{
		level: 'info',
		path: process.env.OUTPUT_LOG
	}]
});

module.exports = log;
