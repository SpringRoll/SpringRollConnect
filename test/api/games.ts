import { expect } from 'chai';
import { API_GAMES_URL } from '../helpers';
import fetch from 'node-fetch';

describe('api/games', () => {
  describe('GET', () => {
    it('should receive a list of all games with a production release, without requiring a token', async () => {
      const response = await fetch(API_GAMES_URL).then(async r => r.json());
      expect(response.success).to.be.true;
      expect(response.data.length).to.be.greaterThan(0);
      expect(response.data[0].releases.length).to.be.greaterThan(0);
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
