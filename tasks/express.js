module.exports = {
    dev:
    {
        options:
        {
            script: 'app/index.js'
        }
    },
    prod:
    {
        options:
        {
            script: 'app/index.js',
            node_env: 'production'
        }
    }
};