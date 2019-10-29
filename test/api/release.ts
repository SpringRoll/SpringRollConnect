const expect = require('chai').expect;
import fetch from 'node-fetch';
const TOKEN = '8ae7aa9e471c7b9d3fdb04f7e80dca5fce59a386';
const addRelease = async (commitId, token = undefined) => {
  const gameSlug = await fetch('http://localhost:3000/api/games')
    .then(r => r.json())
    .then(({ data }) => {
      //ensure that Empty Game is returned, not Empty Game 2
      return data[0].slug === 'empty-game' ? data[0].slug : data[1].slug;
    });

  // make a new commit id for the new release

  const { success } = await fetch(
    `http://localhost:3000/api/release/${gameSlug}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status: 'dev',
        commitId,
        version: '1.0.0',
        token
      })
    }
  ).then(r => r.json());
  token ? expect(success).to.be.true : expect(success).to.be.false;
};
describe('api/release', () => {
  describe('GET', () => {
    it('should return the latest prod release for a game if no token is provided.', async function() {
      const gameResponse = await fetch('http://localhost:3000/api/games').then(
        r => r.json()
      );

      const gameSlug =
        gameResponse.data[0].slug === 'empty-game'
          ? gameResponse.data[0].slug
          : gameResponse.data[1].slug;

      const { success, data } = await fetch(
        `http://localhost:3000/api/release/${gameSlug}`
      ).then(r => r.json());

      expect(success).to.equal(true);
      expect(data.game.slug).to.equal(gameSlug);
    });

    it('should return the dev releases for a game if a valid token is provided.', async () => {
      const gameSlug = await fetch('http://localhost:3000/api/games')
        .then(r => r.json())
        .then(({ data }) => {
          //ensure that Empty Game is returned, not Empty Game 2
          return data[0].slug === 'empty-game' ? data[0].slug : data[1].slug;
        });

      const { success, data } = await fetch(
        `http://localhost:3000/api/release/${gameSlug}?token=${TOKEN}&status=dev`
      ).then(r => r.json());

      expect(success).to.equal(true);
      expect(data.game.slug).to.equal(gameSlug);
    });
  });

  describe('POST', () => {
    it('should be able to make a new release on POST if has editor+ credentials for the game in question', async () =>
      await addRelease('4dd8c2d5a112f25cfba1364403e469043138f79d', TOKEN));

    // it('should not be able to make a new release on POST if no token is provided.', async () =>
    //   await addRelease('31393df7999db415fe745c267b68777bd256c9ac'));
  });
});
