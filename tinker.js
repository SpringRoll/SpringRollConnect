/**
 * A custom Read-Eval-Print-Loop (REPL) for SpringRollConnect
 *
 * This script provides direct access to the SpringRollConnect data model in a REPL so that you can test data structure
 * and queries on the fly without having to put them in a express route. You can invoke this script directly with
 * `node tinker.js`, but there is an npm script `npm run tinker` which will invoke this script with the new
 * --experimental-repl-await flag. That will allow you to write really short queries like this:
 *
 * const game = await Game.findOne({}).populate('groups');
 * const group = await Group.findOne({ _id: game.groups[0].group });
 */
const repl = require('repl');

const dotenv = require('dotenv');
const fs = require('fs');
if (fs.existsSync('.env')) {
  dotenv.load();
}

const app = require('express')();
require('./app/helpers/database')(app);

springrollConnectRepl = repl.start({ useGlobal: true });
springrollConnectRepl.context.User = require('./app/models/user');
springrollConnectRepl.context.Game = require('./app/models/game');
springrollConnectRepl.context.Group = require('./app/models/group');
springrollConnectRepl.context.Release = require('./app/models/release');
