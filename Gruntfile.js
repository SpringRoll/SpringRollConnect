var glob = require('glob');

module.exports = function(grunt)
{
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');

  // load the configuration
  grunt.initConfig({
    concat: {
      'app/public/js/main.js': ['src/plugins/jquery-search.js'].concat(glob.sync('src/widgets/*.js')),
      'app/public/js/embed.js': [
        "src/plugins/jquery-menuToggle.js",
        "src/embed.js"
      ],
      'app/public/js/libraries.js': [
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.min.js",
        "node_modules/bellhop-iframe/dist/bellhop.min.js",
        "node_modules/springroll-container/dist/container.min.js",
        "src/libs/jquery.autogrowtextarea.min.js",
        "src/libs/jquery.mobile.custom.min.js"
      ]
    },
    less: {
      main: {
        'app/public/css/main.css': 'src/main.less'
      },
      embed: {
        'app/public/css/embed.css': 'src/embed.less'
      }
    },
    copy: {
      libraries: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['node_modules/bootstrap/dist/fonts//**'],
            dest: 'app/public/fonts',
            filter: 'isFile'
          },
          {
            src: ['node_modules/bootstrap/dist/css/bootstrap.css'],
            dest: 'app/public/css/libraries.css'
          }
        ]
      }
    }
  });

  grunt.registerTask('default', ['copy', 'concat', 'less']);
};
