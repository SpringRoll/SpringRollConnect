import { expect } from 'chai';
import { createUserGroupGameRelease, API_GAMES_URL } from '../helpers';
import fetch from 'node-fetch';

describe('api/games', () => {
  describe('GET', () => {
    it('should receive a list of all games with a production release, without requiring a token', async () => {
      await createUserGroupGameRelease();
      const response = await fetch(API_GAMES_URL).then(
        async r => await r.json()
      );

      expect(response.success).to.be.true;
      expect(response.data.length).to.equal(1);
      expect(response.data[0].releases.length).to.equal(1);
    });
    it('should receive a list of all games, regardless of release level, if provided a token', async function() {
      const { group } = await createUserGroupGameRelease({
        privilege: 2,
        permission: 2
      });

      const response = await fetch(
        `${API_GAMES_URL}?token=${group.token}`
      ).then(async r => await r.json());

      expect(response.success).to.be.true;
      expect(response.data.length).to.equal(1);
    });
  });
});
