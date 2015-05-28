module.exports = {
    dev:
    {
        options:
        {
            script: 'server.js'
        }
    },
    prod:
    {
        options:
        {
            script: 'server.js',
            node_env: 'production'
        }
    }
};