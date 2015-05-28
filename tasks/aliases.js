module.exports = function(grunt)
{
    grunt.registerTask('default', [
    	'build', 
    	'copy:libraries'
    ]);

    grunt.registerTask('debug', [
    	'build-debug', 
    	'copy:libraries'
    ]);
    
    grunt.registerTask('dev', [
    	'express:dev', 
    	'watch'
    ]);
};