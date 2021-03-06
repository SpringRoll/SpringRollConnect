// Load Environment
const dotenv = require('dotenv');
dotenv.load();
process.env.MONGO_DATABASE = 'mongodb://localhost:27017/connect';
process.env.OUTPUT_LOG = './log.txt';

const crypto = require('crypto');
const app = require('express')();
require('./app/helpers/database')(app);
const User = require('./app/models/user');
const Game = require('./app/models/game');
const Group = require('./app/models/group');
const uuid = require('uuid/v1');
const Release = require('./app/models/release');

function makeRandomString(length) {
  let random = '';
  for (let i = 0; i < length; i++) {
    random += (Math.random() * 10).toString().substring(0, 1);
  }
  return random;
}

async function makeDummyData() {
  let admin = await makeAdmin();
  let game = await makeGame();
  let groups = await makeGroups();
  return Promise.all([admin, game, groups]);
}

async function makeAdmin() {
  console.log('Creating admin user...');
  let passwordAdmin = makeRandomString(16);
  let adminGroup = new Group({
    name: 'adminGroup',
    slug: 'admin',
    token: makeRandomString(40),
    tokenExpires: null,
    privilege: 2,
    isUserGroup: true
  });
  adminGroup.save();
  let admin = new User({
    username: 'admin',
    password: passwordAdmin,
    email: 'empty@email.com',
    name: 'Admin',
    groups: [adminGroup._id]
  });
  console.log(`User admin created with password ${passwordAdmin}`);
  return admin.save();
}

async function makeGame() {
  console.log('Creating example game with releases...');
  //set your values as desired
  let gameParams = {
    title: 'Empty Game',
    slug: 'empty-game',
    repository: 'https://website.com/game',
    location: 'https://website.com/game',
    description: 'an empty game entry',
    isArchived: false
  };
  gameParams.created = gameParams.updated = Date.now();
  let game = new Game(gameParams);
  game.bundleId = uuid();
  game.releases = [];
  game.groups = [];
  game.save();
  let levels = ['dev', 'qa', 'prod'];
  levels.forEach(level => {
    let newRelease = addReleases(game.id, level);
    game.releases.push(newRelease);
  });
  return game.save();
}

function addReleases(gameId, releaseLevel) {
  console.log('Adding release with level: ' + releaseLevel);

  // make the release sizes somewhere between 1 and 100 mb
  const releaseCompressedSize = Math.floor(1024 * 1024 + (Math.random() * 100 * 1024 * 1024));
  const releaseUncompressedSize = Math.floor(1024 * 1024 + (Math.random() * 100 * 1024 * 1024));

  let commitHash = makeRandomString(40);
  let releaseParams = {
    game: gameId,
    status: releaseLevel,
    // branch: 'origin/my-branch',
    commitId: commitHash,
    releaseCompressedSize,
    releaseUncompressedSize,
    created: Date.now(),
    updated: Date.now()
  };
  let release = new Release(releaseParams);
  release.save();
  return release;
}

async function makeGroups() {
  console.log('Creating example groups...');
  let groupA = new Group({
    name: 'GroupA',
    privilege: 0,
    slug: 'groupSlugA',
    token: 'groupAToken',
    tokenExpires: null,
    isUserGroup: false,
    games: []
  });
  return groupA
    .save()
    .then(() => {
      return addUsers(groupA);
    })
    .then(() => {
      let groupB = new Group({
        name: 'GroupB',
        privilege: 0,
        slug: 'groupSlugB',
        token: 'groupBToken',
        tokenExpires: null,
        isUserGroup: false,
        games: []
      });
      return groupB.save().then(() => {
        return addUsers(groupB);
      });
    });
}

async function addUsers(incGroup) {
  console.log('Creating creating non-admin user for group...');
  let password = makeRandomString(16);
  let userHash = 'user' + makeRandomString(4);
  let newUserGroup = new Group({
    name: userHash,
    slug: userHash,
    token: makeRandomString(40),
    tokenExpires: null,
    privilege: 1,
    isUserGroup: true
  });
  newUserGroup.save();
  console.log('Made user specific group, now making user...');
  let newUser = new User({
    username: userHash,
    password: password,
    email: userHash + '@email.com',
    name: userHash,
    groups: [newUserGroup._id, incGroup._id]
  });
  return newUser.save();
}

makeDummyData()
  .then(() => {
    console.log('Dummy data loaded!');
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(-1);
  });
