const expect = require("chai").expect;
const mongoose = require('mongoose');
const request = require("superagent");
const dataMakers = require("../helpers/data");

describe("api/games", ()=>{
  it("should receive a list of all games with a production release, without requiring a token", done => {
    // need to uhhh make some games.
    dataMakers.makeGame("prod")
    .then(()=> {
      return request.get("http://localhost:3000/api/games")
    })
    .then(response => {
      try {
        expect(response.body.success).to.equal(true);
        expect(response.body.data.length).to.equal(1);
        expect(response.body.data[0].releases.length).to.equal(1);
        done();
      } catch (e){
        done(e);
      }
    });
  });
  it("should receive a list of all games, regardless of release level, if provided a token", done => {
    // need to uhhh make a user and get their token.
    mongoose.model('User').createUser(
      {
        name: 'Spring Roll',
        username: 'testuser',
        password: 'secret',
        email: 'email@springroll.io'
      },
      2,
      async function (){
        let user = await mongoose.model('User').getByUsername('testuser');
        let token = user.groups[0].token;
        dataMakers.makeGame("dev")
        .then(()=> {
          return request
          .get("http://localhost:3000/api/games")
          .query(`token=${token}`)
        })
        .then(response => {
          try {
            expect(response.body.success).to.equal(true);
            expect(response.body.data.length).to.equal(1);
            done();
          } catch (e){
            done(e);
          }
        });
      });
  });
});