const Release = require('../../app/models/release');
const Game = require('../../app/models/game');
const uuid = require('uuid/v1');
const Group = require('../../app/models/group');
const User = require('../../app/models/user');

function makeRandomString(length){
  let random = '';
  for (i=0; i < length; i++ ){
    random += (Math.random()*10).toString().substring(0,1);
  }
  return random;
}

async function makeGame(releaseLevel){
  //set your values as desired
  let gameParams = {
    title: makeRandomString(40),
    slug: makeRandomString(40),
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
  await game.save();
  let newRelease = await makeRelease(game.id, releaseLevel);
  await game.releases.push(newRelease);
  return game.save()
}

async function makeRelease(gameId, releaseLevel){
  let commitHash = makeRandomString(40);
  let releaseParams = {
    game: gameId,
    status: releaseLevel,
    // branch: 'origin/my-branch',
    commitId: commitHash,
    created: Date.now(),
    updated: Date.now(),
  }
  let release = await new Release(releaseParams);
  return release.save();
}

async function makeUser(privilegeLevel){
  let password = makeRandomString(16);
  let userHash = 'user' + makeRandomString(4);
  let newUserGroup = new Group({
    name: userHash,
    slug: userHash,
    token: userHash,
    tokenExpires: null,
    privilege: privilegeLevel,
    isUserGroup: true
  });
  await newUserGroup.save();
  let newUser = new User({
    username: userHash,
    password: password,
    email: userHash + '@email.com',
    name: userHash,
    groups: [newUserGroup._id]
  });
  return newUser.save();
}

async function getUserToken(user){
  let group = await Group.getById(user.groups[0])
  return group.token;
}

module.exports = {makeGame, makeRelease, makeUser, getUserToken}