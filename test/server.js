const spawn = require('child_process').spawn;

const server = {
  init: () => {
    return new Promise(resolve => {
      server.process = spawn('node', ['server.js']);

      // wait for the server to be up
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  }
};

module.exports = server;
