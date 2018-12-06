var cluster = require('cluster');
var totalCpus = require('os').cpus().length;
// if (cluster.isMaster) {
//   //If a thread dies, respawn it.
//   cluster.on('exit', function(worker, code, signal) {
//     cluster.fork();
//   });

//   for (var i = 0; i < totalCpus; i++) {
//     cluster.fork();
//   }
// } else {
var restServer = require('./app/index.ts');
// }
