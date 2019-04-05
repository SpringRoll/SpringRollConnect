const cluster = require('cluster');
const totalCpus = require('os').cpus().length;
require('dotenv').config();
// TODO: Re-enable
// if (cluster.isMaster) {
//   //If a thread dies, respawn it.
//   cluster.on('exit', function(worker, code, signal) {
//     cluster.fork();
//   });

//   for (var i = 0; i < totalCpus; i++) {
//     cluster.fork();
//   }
// } else {
require('./app/index');
// }
