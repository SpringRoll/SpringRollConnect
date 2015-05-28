var router = require('express').Router();
var User = require('../../models/user');

router.post('/', function(req, res)
{
	if (req.body.username)
	{
		res.send(User.getByUsername(req.body.username).select('name'));
	}
	else if (req.user && req.body.search)
	{
		res.send(User.getBySearch(req.body.search, 10));
	}
	else if (req.body.email)
	{
		res.send(User.getByEmail(req.body.email).select('name'));
	}
});

module.exports = router;