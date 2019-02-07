const expect = require("chai").expect;
const mongoose = require('mongoose');
const request = require("superagent");
const dataMakers = require("../helpers/data");

describe("api/games", ()=>{
  describe("GET", ()=>{
    it("should receive a list of all games with a production release, without requiring a token", async function () {
      await dataMakers.makeGame("prod");
      let response = await request.get("http://localhost:3000/api/games");
      expect(response.body.success).to.equal(true);
      expect(response.body.data.length).to.equal(1);
      expect(response.body.data[0].releases.length).to.equal(1);
    });
    it("should receive a list of all games, regardless of release level, if provided a token", async function () {
      let user = await dataMakers.makeUser(2);
      let token = await dataMakers.getUserToken(user);
      await dataMakers.makeGame("dev");
      let response = await request
      .get("http://localhost:3000/api/games")
      .send({token: token});
      expect(response.body.success).to.equal(true);
      expect(response.body.data.length).to.equal(1);
    });
  });
});