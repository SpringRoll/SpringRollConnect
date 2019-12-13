import { expect } from 'chai';
import {
  createUserGroupGameRelease,
  API_GAMES_URL,
  makeGame,
  makeRelease
} from '../helpers';
import fetch from 'node-fetch';

describe('api/games', () => {
  describe('GET', () => {
    it('should receive a list of all games, with a production release if they have one, without requiring a token', async () => {
      await createUserGroupGameRelease();
      const response = await fetch(API_GAMES_URL).then(
        async r => await r.json()
      );

      expect(response.success).to.be.true;
      expect(response.data.length).to.equal(1);
      expect(response.data[0].releases.length).to.equal(1);
    });

    it('should recieve a list of only games with a prod release, without requiring a token', async () => {
      const groupUserGameReleaseProd = await createUserGroupGameRelease();

      const devGame = await makeGame({
        name: 'Dev Game',
        slug: 'dev-game',
        bundleId: 'com.domain.game.SomeDevGame',
        groups: [{ permission: 0, group: groupUserGameReleaseProd.group._id }]
      });
      const devRelease = await makeRelease(devGame, 'dev');

      const prodResponse = await fetch(API_GAMES_URL + '?status=prod').then(
        async r => await r.json()
      );

      expect(prodResponse.success).to.be.true;
      expect(prodResponse.data.length).to.equal(1);
      expect(prodResponse.data[0].releases.length).to.equal(1);

      const allResponse = await fetch(API_GAMES_URL).then(
        async r => await r.json()
      );

      expect(allResponse.success).to.be.true;
      expect(allResponse.data.length).to.equal(2);
      expect(allResponse.data[0].releases.length).to.equal(1);
      expect(allResponse.data[1].releases.length).to.equal(0);
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

    it('should return a caching header if asking for a prod release', async function() {
      await createUserGroupGameRelease();
      
      const response = await fetch(API_GAMES_URL);

      expect(response.headers.get('Cache-Control')).to.not.equal(null);
    });

    it('should not return a cache header if the requestor is asking for a dev release', async function() {
      const { group } = await createUserGroupGameRelease({
        privilege: 2,
        permission: 2
      });

      const response = await fetch(`${API_GAMES_URL}?token=${group.token}&status=dev`);

      expect(response.headers.get('Cache-Control')).to.equal(null);
    });

    it('should return a 422 if the provided input is invalid', async function() {
      const response = await fetch(`${API_GAMES_URL}?token=invalid&status=invalid`);

      expect(response.status).to.equal(422);
    });

    it('should return a 403 if dev games are requested without a token', async function() {
      const response = await fetch(`${API_GAMES_URL}?status=dev`);
      expect(response.status).to.equal(403);
    });

    it('should return a 403 if the provided token is a not a real token', async function() {
      const response = await fetch(`${API_GAMES_URL}?status=dev&token=1234567890123456789012345678901234567890`);
      expect(response.status).to.equal(403);
    });
  });
});
