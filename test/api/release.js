const expect = require('chai').expect;
const request = require('superagent');

describe('api/release', () => {
  describe('GET', () => {
    it('should return the latest prod release for a game if no token is provided.', async function() {
      let gameResponse = await request.get('http://localhost:3000/api/games');
      let gameSlug = gameResponse.body.data[0].slug;
      let releaseResponse = await request.get(
        `http://localhost:3000/api/release/${gameSlug}`
      );
      expect(releaseResponse.body.success).to.equal(true);
      expect(releaseResponse.body.data.game.slug).to.equal(gameSlug);
    });

    it('should return the dev releases for a game if a valid token is provided.', async function() {
      // make a write level access token

      let gameResponse = await request.get('http://localhost:3000/api/games');
      // get the game slug from the api response
      let gameSlug = gameResponse.body.data[0].slug;

      // add the editor token's group to the game's definition

      // send the request

      let releaseResponse = await request
        .get(`http://localhost:3000/api/release/${gameSlug}`)
        .query(`token=${'TODO: ADD TOKEN'}`)
        .query('status=dev');

      expect(releaseResponse.body.success).to.equal(true);
      expect(releaseResponse.body.data.game.slug).to.equal(gameSlug);
    });
  });

  describe('POST', () => {
    it('should be able to make a new release on POST if has editor+ credentials for the game in question', async function() {
      let gameResponse = await request.get('http://localhost:3000/api/games');

      // make a write level access token

      // get the game slug from the api response
      let gameSlug = gameResponse.body.data[0].slug;

      // make a new commit id for the new release

      // // send the request
      // let releaseParams = {
      //   status: 'dev',
      //   commitId: commitId,
      //   version: '1.0.0',
      //   token: token
      // };

      let postResponse = await request
        .post(`http://localhost:3000/api/release/${gameSlug}`)
        .send();
      expect(postResponse.body.success).to.equal(true);
    });

    it('should not be able to make a new release on POST if no token is provided.', async function() {
      // need to uhhh make some games.

      let gameResponse = await request.get('http://localhost:3000/api/games');
      // get the game slug from the api response
      let gameSlug = gameResponse.body.data[0].slug;
      // make a new commit id for the new release

      // send the request
      let releaseParams = {
        status: 'dev',

        version: '1.0.0'
      };

      let postResponse = await request
        .post(`http://localhost:3000/api/release/${gameSlug}`)
        .send(releaseParams);
      expect(postResponse.body.success).to.equal(false);
    });
  });
});
