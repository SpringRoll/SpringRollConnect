const Mongoose = require('mongoose');
Mongoose.Promise = Promise;
import {
  Selenium,
  Database,
  ROOT_DOMAIN,
  browser,
  VERSION,
  logout
} from './helpers';

before(() => Promise.all([Selenium.init(), Database.connect()]));

afterEach(async () => {
  await logout();
  await Mongoose.connection.db.dropDatabase();
});

after(() => {
  Selenium.Browser.quit();
  Database.connection.close();
});

const expect = require('chai').expect;

describe('SpringRollConnect', () => {
  it('should have the correct title', () => {
    return browser
      .get(ROOT_DOMAIN)
      .then(() => browser.getTitle())
      .then(title =>
        expect(title).to.equal(`Login - SpringRoll Connect v${VERSION}`)
      );
  });
});

require('./api/games');
