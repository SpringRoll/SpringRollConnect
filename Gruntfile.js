var projectConfig = require('./project.json');
var registerModule = require('./grunt/register-module');

module.exports = function(grunt)
{
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');

  // register the three "main" modules
  registerModule('main', projectConfig.main);
  registerModule('libraries', projectConfig.libraries);
  registerModule('librariesDebug', projectConfig.librariesDebug);

  // if there are any extra modules, register those too
  Object.keys(projectConfig.modules).forEach(function(moduleName) {
    registerModule(moduleName, projectConfig.modules[moduleName]);
  });

  // load the configuration
  grunt.initConfig(require('./grunt/config'));

  // add the tasks aliases
  var taskAliases = require('./grunt/aliases');
  Object.keys(taskAliases).forEach(function(aliasName) {
    grunt.registerTask(aliasName, taskAliases[aliasName]);
  });
};
