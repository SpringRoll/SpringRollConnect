/**
 * Generate the MySQL select parameter for creating
 * a release URL, which is a combination of
 * the game location, commit id and if we should
 * be a release, debug or archive
 * @method concat-url
 * @param {request} req The express request object
 */
module.exports = function(req)
{
	var game = require('../models/game.js'),
		release = require('../models/release.js');

	var path = '';
	if (req.query.debug)
		path += 'debug/index.html';
	else
		path += 'release/index.html';

	if (req.query.archive)
		path += '.zip';

	var table = release.commitId.table.getName();
	var name = release.commitId.name;

	return 'CONCAT(' + 
		game.location.toNode() + ", " + 
		"`" + table + "`.`" + name + "`, '/" + 
		path + "') as `url`";
};
