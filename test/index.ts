import { getConnection } from 'typeorm';
import { browser, MAIN_URL, logout } from './helpers';
import { server } from '../server';
import testData from './testSQL';

let app;
before(async () => {
  app = await server;
  await browser.get(MAIN_URL).catch(err => err);
});

beforeEach(async () => {
  const connection = getConnection();
  await connection.dropDatabase().then(() => connection.query(testData));
});

afterEach(async () => await logout());

after(async () => {
  await browser.close();
  await app.close();
});

import './api';
// import './pages';
