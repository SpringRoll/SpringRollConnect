var router = require('express').Router(),
    async = require('async'),
    _ = require('lodash'),
    Release = require('../../models/release'),
    Group = require('../../models/group'),
    Game = require('../../models/game'),
    response = require('../../helpers/response');

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.get('/', function(req, res)
{
    req.checkQuery('status').isStatus();
    req.checkQuery('token').optional().isToken();
    if(req.validationErrors())
    {
        return response.call(res, "Invalid Arguments");
    }
    
    async.waterfall([
        function(done)
        {
            Game.getAll(response.bind(res)).select('-thumbnail');
        },
        function(done)
        {
            response.bind(res);
        }

    ]);
});

module.exports = router;
