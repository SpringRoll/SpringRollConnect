import { expect } from 'chai';
import { API_GAMES_URL } from '../helpers';
import fetch from 'node-fetch';

describe('api/games', () => {
  describe('GET', () => {
    it('should receive a list of all games, along with a production release if they have one, without requiring a token', async () => {
      const response = await fetch(API_GAMES_URL).then(async r => r.json());
      expect(response.success).to.be.true;
      expect(response.data.length).to.be.greaterThan(0);
      //to account for changes in the returned order of the games
      if (response.data[0].slug === 'empty-game-2') {
        expect(response.data[0].releases.length).to.equal(0);
        expect(response.data[1].releases.length).to.be.greaterThan(0);
      } else {
        expect(response.data[0].releases.length).to.be.greaterThan(0);
        expect(response.data[1].releases.length).to.equal(0);
      }
    });

    it('should recieve a list of only games with a prod release when provided with status=prod, without requiring a token', async () => {
      const prodResponse = await fetch(API_GAMES_URL + '?status=prod').then(
        async r => await r.json()
      );

      expect(prodResponse.success).to.be.true;
      expect(prodResponse.data.length).to.equal(1);
      expect(prodResponse.data[0].releases.length).to.equal(1);
    });

    it('should receive a list of all games, regardless of release level, if provided a token', async function() {
      const response = await fetch(
        `${API_GAMES_URL}?token=${'8ae7aa9e471c7b9d3fdb04f7e80dca5fce59a386'}`
      ).then(async r => await r.json());
      expect(response.success).to.be.true;
      expect(response.data.length).to.equal(1);
    });
  });
});
