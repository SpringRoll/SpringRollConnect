module.exports = {
    libraries:
    {
        files: [
        {
            expand: true,
            flatten: true,
            src: ['components/bootstrap/dist/fonts/**'],
            dest: 'app/public/fonts',
            filter: 'isFile'
        }]
    }
};