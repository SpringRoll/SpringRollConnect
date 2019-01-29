const Release = require('../../app/models/release');
const Game = require('../../app/models/game');
const uuid = require('uuid/v1');

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
  game.save();
  let newRelease = await addReleases(game.id, releaseLevel);
  await game.releases.push(newRelease);
  return game.save()
}

async function addReleases(gameId, releaseLevel){
  let commitHash = makeRandomString(40);
  let releaseParams = {
    game: gameId,
    status: releaseLevel,
    // branch: 'origin/my-branch',
    commitId: commitHash,
    created: Date.now(),
    updated: Date.now(),
  }
  let release = new Release(releaseParams);
  await release.save();
  return release;
}

module.exports = {makeGame, addReleases}