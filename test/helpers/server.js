const spawn = require("child_process").spawn;

const server = {
  /**
   * Initializes a running instance of the SpringRollConnect server so that we can make requests to it
   * @return Promise A promise that resolves when the server is setup
   */
  init: () => {
    return new Promise(resolve => {
      server.process = spawn("node", ["server.js"]);

      // wait for the server to be up
      setTimeout(() => {
        resolve();
      }, 1000);
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
