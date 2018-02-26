// initial grunt config. register-module, appends onto this with tasks
module.exports = {
  concat: {},
  less: {},
  copy: {
    libraries: {
      files: [
        {
          expand: true,
          flatten: true,
          src: ['components/bootstrap/dist/fonts/**'],
          dest: 'app/public/fonts',
          filter: 'isFile'
        }
      ]
    }
  }
};
