const Mongoose = require('mongoose');
import { Selenium, Database, logout } from './helpers';

before(done => {
  Database.connect(async connection => {
    connection.db.dropDatabase();
    await Selenium.init();
    done();
  });
});

afterEach(async () => {
  await logout();
  await Mongoose.connection.db.dropDatabase();
});

after(() => {
  Selenium.Browser.quit();
  Database.connection.close();
});
import './api';
import './pages';
