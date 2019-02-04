const { spawn } = require('child_process');
require('child_process');
let process = undefined;
export class Server {
  static init() {
    return new Promise((resolve, reject) => {
      process = spawn('node_modules/.bin/nyc', ['app/index.js'], {
        stdio: ['ipc']
      })
        .on('message', () => resolve())
        .on('error', () => reject());
    });
  }

  static kill() {
    process.kill();
  }
}
