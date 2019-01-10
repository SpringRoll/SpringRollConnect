const mongoose = require('mongoose');
const server = require('./helpers/server');
const selenium = require('./helpers/selenium');
const database = require('./helpers/database');

before(() => {
  return Promise.all([
    database.init(),
    selenium.init(),
    server.init()
  ]);
});

afterEach(done => {
  mongoose.connection.db.dropDatabase(done)
});

after(() => {
  selenium.browser.quit();
  server.process.kill();
  database.connection.close();
});

const expect = require('chai').expect;

describe('SpringRollConnect', () => {
  it('should have the correct title', () => {
    return selenium.browser.get('http://localhost:3000')
      .then(() => selenium.browser.getTitle())
      .then(title => {
        expect(title).to.equal('Login - SpringRoll Connect v1.6.4');
      });
  });
});
