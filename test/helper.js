const server = require('./server');
const selenium = require('./selenium');
const database = require('./database');

beforeEach(() => {
  return Promise.all([
    database.init(),
    selenium.init(),
    server.init()
  ]);
});

afterEach(() => {
  selenium.browser.quit();
  server.process.kill();
  database.connection.close();
});
