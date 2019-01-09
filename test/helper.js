const server = require('./server');
const selenium = require('./selenium');

beforeEach(() => {
  return Promise.all([
    selenium.init(),
    server.init()
  ]);
});

afterEach(() => {
  selenium.browser.quit();
  server.process.kill();
});
