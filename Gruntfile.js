module.exports = function(grunt)
{
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');

  // load the configuration
  grunt.initConfig(require('./grunt/config'));

  grunt.registerTask('debug', ['copy', 'concat', 'less']);
  grunt.registerTask('default', ['debug']); // TODO: add minify tasks
};
