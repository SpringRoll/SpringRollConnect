const expect = require('chai').expect;
const mongoose = require('mongoose');
import fetch from 'node-fetch';
const request = require('superagent');
const dataMakers = require('../helpers/data');
const Game = require('../../app/models/game');

describe('api/release', () => {
  describe('GET', () => {
    it('should return the latest prod release for a game if no token is provided.', async function() {
      await dataMakers.makeGame('prod');
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
      let editor = await dataMakers.makeUser(2);
      let token = await dataMakers.getUserToken(editor);

      await dataMakers.makeGame('dev');
      let gameResponse = await request.get('http://localhost:3000/api/games');
      // get the game slug from the api response
      let gameSlug = gameResponse.body.data[0].slug;

      // add the editor token's group to the game's definition
      let gameObject = await Game.getBySlug(gameSlug);
      gameObject.groups.push({
        group: editor.groups[0],
        permission: 2
      });
      await gameObject.save();

      // send the request
      let releaseParams = {
        token: token,
        status: 'dev'
      };

      let releaseResponse = await request
        .get(`http://localhost:3000/api/release/${gameSlug}`)
        .query(`token=${token}`)
        .query('status=dev');

      expect(releaseResponse.body.success).to.equal(true);
      expect(releaseResponse.body.data.game.slug).to.equal(gameSlug);
    });

    it('should provide caching headers for non dev games', async function() {
      const game = await dataMakers.makeGame('prod');
      const response = await fetch(`http://localhost:3000/api/release/${game.slug}`);
      expect(response.headers.get('Cache-Control')).to.not.equal(null);
    });

    it('should not provide caching headers for dev games', async function() {
      const game = await dataMakers.makeGame('dev');
      const response = await fetch(`http://localhost:3000/api/release/${game.slug}?status=dev`);
      expect(response.headers.get('Cache-Control')).to.equal(null);
    });

    it('should respond with a 404 if a request is made for a slug that does not exist', async function() {
      const response = await fetch(`http://localhost:3000/api/release/dont-exists`);
      expect(response.status).to.equal(404);
    });

    it('should respond with a 404 if a request is made for a game that does not have a prod release', async function() {
      const game = await dataMakers.makeGame('dev');
      const response = await fetch(`http://localhost:3000/api/release/${game.slug}`);
      expect(response.status).to.equal(404);
    });

    it('should respond with a 403 if a request is made for a dev release without a token', async function() {
      const game = await dataMakers.makeGame('dev');
      const response = await fetch(`http://localhost:3000/api/release/${game.slug}?status=dev`);
      const json = await response.json();
      console.log('JSON RESPONSE:', json);

      expect(response.status).to.equal(403);
    });
  });

  describe('POST', () => {
    it('should be able to make a new release on POST if has editor+ credentials for the game in question', async function() {
      await dataMakers.makeGame('prod');
      let gameResponse = await request.get('http://localhost:3000/api/games');

      // make a write level access token
      let editor = await dataMakers.makeUser(2);
      let token = await dataMakers.getUserToken(editor);
      // get the game slug from the api response
      let gameSlug = gameResponse.body.data[0].slug;

      // add the editor token's group to the game's definition
      let gameObject = await Game.getBySlug(gameSlug);
      gameObject.groups.push({
        group: editor.groups[0],
        permission: 2
      });
      await gameObject.save();

      // make a new commit id for the new release
      let commitId = dataMakers.makeRandomString(40);
      // send the request
      let releaseParams = {
        status: 'dev',
        commitId: commitId,
        version: '1.0.0',
        token: token
      };

      let postResponse = await request
        .post(`http://localhost:3000/api/release/${gameSlug}`)
        .send(releaseParams);
      expect(postResponse.body.success).to.equal(true);
    });

    it('should not be able to make a new release on POST if no token is provided.', async function() {
      // need to uhhh make some games.
      await dataMakers.makeGame('prod');
      let gameResponse = await request.get('http://localhost:3000/api/games');
      // get the game slug from the api response
      let gameSlug = gameResponse.body.data[0].slug;
      // make a new commit id for the new release
      let commitId = dataMakers.makeRandomString(40);
      // send the request
      let releaseParams = {
        status: 'dev',
        commitId: commitId,
        version: '1.0.0'
      };

      let postResponse = await request
        .post(`http://localhost:3000/api/release/${gameSlug}`)
        .send(releaseParams);
      expect(postResponse.body.success).to.equal(false);
    });

    it('should still allow an admin user to create a game, even if they do not have privileges on that game', async function() {
      await dataMakers.makeGame('prod');
      let gameResponse = await request.get('http://localhost:3000/api/games');

      // make a admin level access token
      let editor = await dataMakers.makeUser(2);
      let token = await dataMakers.getUserToken(editor);
      // get the game slug from the api response
      let gameSlug = gameResponse.body.data[0].slug;

      // make a new commit id for the new release
      let commitId = dataMakers.makeRandomString(40);

      // send the request
      let releaseParams = {
        status: 'dev',
        commitId: commitId,
        version: '1.0.0',
        token: token
      };

      let postResponse = await request
        .post(`http://localhost:3000/api/release/${gameSlug}`)
        .send(releaseParams);
      expect(postResponse.body.success).to.equal(true);
    });
  });
});
