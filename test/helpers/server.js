const spawn = require("child_process").spawn;

const server = {
  /**
   * Initializes a running instance of the SpringRollConnect server so that we can make requests to it
   * @return Promise A promise that resolves when the server is setup
   */
  init: () => {
    return new Promise((resolve, reject) => {
      server.process = spawn("node_modules/.bin/nyc", ["app/index.js"], {
        stdio: ["ipc"]
      });

      // wait for the child process to send a message when it's alive
      let gotMessage = false;
      server.process.on('message', () => {
        gotMessage = true;
        resolve();
      });

      // if it takes to long, reject it
      setTimeout(() => {
        if (!gotMessage) {
          reject();
        }
      }, 5000);
    });
  },

  /**
   * A reference to the child process that was spawned.
   * @type ChildProcess
   * @see {@link https://nodejs.org/api/child_process.html#child_process_class_childprocess}
   */
  process: null
};

module.exports = server;
