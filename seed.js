// Load Environment
var dotenv = require('dotenv');
dotenv.load();
process.env.MONGO_DATABASE = 'mongodb://localhost:27017/connect';
process.env.OUTPUT_LOG = './log.txt';

// create a password
var crypto = require('crypto');
var app = require('express')();

// stub out the schema
require('./app/helpers/database')(app);

// create an admin user
var User = require('./app/models/user');
var Game = require('./app/models/game');
var Group = require('./app/models/group');
var uuid = require('uuid/v1');
var Release = require('./app/models/release');

function makeRandomString(length){
  var random = '';
  crypto.randomBytes(length).forEach(value => {
    random += (value % length).toString(length);
  });
  return random;
}

async function makeDummyData(){
  var admin = await makeAdmin();
  var game = await makeGame();
  var groups = await makeGroups();
  return Promise.all([
    admin,
    game,
    groups
  ]);
}

async function makeAdmin() {
  console.log('Creating admin user...');
  var passwordAdmin = makeRandomString(16);
  var adminGroup = new Group({
    name: 'Admin2',
    slug: 'Admin2',
    token: 'myAccessToken',
    tokenExpires: null,
    privilege: 2,
    isUserGroup: true
  });
  adminGroup.save();
  var admin = new User({
    username: 'admin',
    password: passwordAdmin,
    email: 'empty@email.com',
    name: 'Admin',
    groups: [adminGroup._id]
  });
  console.log(`User admin created with password ${passwordAdmin}`);
  return admin.save();
}

async function makeGame(){
  console.log('Creating example game with releases...');
  //set your values as desired
  var gameParams = {
    title: '',
    slug: '',
    repository: '',
    location: '',
    description: 'A placeholder game for testing.'
  };
  gameParams.created = gameParams.updated = Date.now();
  var game = new Game(gameParams);
  game.bundleId = uuid();
  game.releases = [];
  game.groups = [];
  game.save();
  var levels = ["dev", "qa", "prod"];
  levels.forEach(level => {
    var newRelease = addReleases(game.id, level);
    game.releases.push(newRelease);
  });
  return game.save()
}

function addReleases(gameId, releaseLevel){
  console.log('Adding release with level: ' + releaseLevel);
  var commitHash = makeRandomString(16);
  var releaseParams = {
    game: gameId,
    status: releaseLevel,
    branch: 'origin/my-branch',
    commitId: commitHash,
    created: Date.now(),
    updated: Date.now(),
  }
  var release = new Release(releaseParams);
  release.save();
  return release;
}

async function makeGroups(){
  console.log('Creating example groups...');
  var groupA = new Group({
    name: 'GroupA',
    privilege: 0,
    slug: 'groupSlugA',
    token: 'groupAToken',
    tokenExpires: null,
    isUserGroup: false,
    games: []
  });
  return groupA.save()
  .then(() => {
    return addUsers(groupA);
  })
  .then(() => {
    var groupB = new Group({
      name: 'GroupB',
      privilege: 0,
      slug: 'groupSlugB',
      token: 'groupBToken',
      tokenExpires: null,
      isUserGroup: false,
      games: []
    });
    return groupB.save()
    .then(() => {
      return addUsers(groupB);
    });
  });
}

async function addUsers(incGroup){
  console.log('Creating creating non-admin user for group...');
  var password = makeRandomString(16);
  var userHash = 'user' + makeRandomString(4);
  var newUserGroup = new Group({
    name: userHash,
    slug: userHash,
    token: userHash,
    tokenExpires: null,
    privilege: 1,
    isUserGroup: true
  });
  newUserGroup.save();
  console.log('Made user specific group, now making user...')
  var newUser = new User({
    username: userHash,
    password: password,
    email: userHash + '@email.com',
    name: userHash,
    groups: [newUserGroup._id, incGroup._id]
  });
  return newUser.save();
}

makeDummyData()
.then(()=>{
  console.log('Dummy data loaded!');
  process.exit(0);
})
.catch(err => {
  console.log(err);
  process.exit(-1);
});