const Mongoose = require('mongoose');
Mongoose.Promise = Promise;
import { Selenium, Database, logout } from './helpers';

before(async () => {
  await Promise.all([Selenium.init(), Database.connect()]);
  await Mongoose.connection.db.dropDatabase();
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
