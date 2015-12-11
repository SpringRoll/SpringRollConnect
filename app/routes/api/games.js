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
    group = Group.getByToken(req.query.token);
    Game
    .getAll(response.bind(res))
    .select('-thumbnail')
    .populate({
        path: 'releases', 
        select: 'status updated',
        match: {'status': {$in: [req.query.status]}},
        options: {
            sort: {updated: -1},
            limit: 1
        }
    })
});

module.exports = router;
