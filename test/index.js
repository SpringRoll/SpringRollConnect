// const mongoose = require('mongoose');
import Mongoose from 'mongoose';
import { Selenium, Database, ROOT_DOMAIN, sleep } from './helpers';
import { beforeEach } from 'mocha';

before(() => Promise.all([Selenium.init(), Database.connect()]));

afterEach(done => Mongoose.connection.db.dropDatabase(done));

after(() => {
  Selenium.Browser.quit();
  Database.connection.close();
});

const expect = require('chai').expect;

describe('SpringRollConnect', () => {
  it('should have the correct title', () => {
    return Selenium.Browser.get(ROOT_DOMAIN)
      .then(() => Selenium.Browser.getTitle())
      .then(title => {
        expect(title).to.equal('Login - SpringRoll Connect v1.6.4');
      });
  });
});
