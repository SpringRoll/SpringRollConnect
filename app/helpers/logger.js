// Declare an "log stream" for bunyan to write to a file
var streams = [
  {
    level: 'info',
    path: process.env.OUTPUT_LOG
  }
];

// // If we're not in production also log to standard out
// if (process.env.NODE_ENV !== 'production') {
//   streams.push({
//     level: 'info',
//     stream: process.stdout
//   });
// }

var bunyan = require('bunyan');
var log = bunyan.createLogger({
  name: 'springroll-connect'
  // streams: streams
});

module.exports = log;
