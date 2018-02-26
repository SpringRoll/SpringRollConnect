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
        "components/jquery/dist/jquery.min.js",
        "components/jquery-ui/jquery-ui.min.js",
        "components/bootstrap/dist/js/bootstrap.min.js",
        "components/modernizr/modernizr.js",
        "components/bellhop/dist/bellhop.min.js",
        "components/springroll-container/dist/container.min.js",
        "components/autogrow-textarea/jquery.autogrowtextarea.min.js",
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
            src: ['components/bootstrap/dist/fonts/**'],
            dest: 'app/public/fonts',
            filter: 'isFile'
          },
          {
            src: ['components/bootstrap/dist/css/bootstrap.css'],
            dest: 'app/public/css/libraries.css'
          }
        ]
      }
    }
  });

  grunt.registerTask('default', ['copy', 'concat', 'less']);
};
