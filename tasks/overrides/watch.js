module.exports = {
    options:
    {
        livereload: true
    },
    scripts:
    {
        files: '<%= jshint.main %>',
        tasks: ['jshint']
    },
    express:
    {
        files: '<%= jshint.main %>',
        tasks: ['express:dev'],
        options:
        {
            spawn: false
        }
    }
};