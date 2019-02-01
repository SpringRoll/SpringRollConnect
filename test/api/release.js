const expect = require("chai").expect;
const mongoose = require('mongoose');
const request = require("superagent");
const dataMakers = require("../helpers/data");
const Game = require('../../app/models/game');

describe("api/release", ()=>{
  it("should return the latest prod release for a game, with no token", () => {
    dataMakers.makeGame("prod")
    .then(()=> {
      return request.get("http://localhost:3000/api/games");
    })
    .then(response => {
      // get the game slug from the api response
      let gameSlug = response.body.data[0].slug;
      return request.get(`http://localhost:3000/api/release/${gameSlug}`);
    })
    .then(response => {
      expect(response.success).to.equal(true);
      expect(response.body.data.length).to.equal(1);
    });
  });

  it("should be able to make a new release on POST", done => {
    // need to uhhh make some games.
    dataMakers.makeGame("prod")
    .then(()=> {
      return request.get("http://localhost:3000/api/games");
    })
    .then(async function (response){
      // make a write level access token
      let editorGroup = await dataMakers.makeUser(2);
      let user = await mongoose.model('User').getByUsername('testuser');
      let token = user.groups[0].token;
      // get the game slug from the api response
      let gameSlug = response.body.data[0].slug;
      // add the editor token's group to the game's definition
      let gameObject = await Game.getBySlug(gameSlug);
      gameObject.groups.push({
        group: user.groups[0],
        permission: 2
      });
      await gameObject.save();
      // make a new commit id for the new release
      let commitId = dataMakers.makeRandomString(40);
      // send the request
      let releaseParams = {
        "status": "dev",
        "commitId": commitId,
        "version": "1.0.0",
        "token": token
      };
      console.log(releaseParams);
      return request
      .post(`http://localhost:3000/api/release/${gameSlug}`)
      .send(releaseParams);
    })
    .then(response => {
      console.log(response.body);
      try {
        expect(response.body.success).to.equal(true);
        done();
      }
      catch (e){
        done(e);
      }
    });
  });
});