var router = require('express').Router();

router.get('/', function(req, res)
{
	render(res, null, req.flash('success'));
});

router.post('/', function(req, res)
{
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('username', 'Username is required').notEmpty().isAlpha();
	req.checkBody('email', 'Email needs to be valid email address').isEmail();
	var errors = req.validationErrors();
	
	if (errors)
	{
		render(res, errors);
		return;
	}

	var values = {};
	var update = false;
	for(var key in req.body)
	{
		// Changes only
		if (req.user[key] != req.body[key])
		{
			values[key] = req.body[key];
			update = true;
		}
	}
	
	if (!update)
	{
		render(res, "No changes to update.");
		return;
	}

	req.user.update(values, function(err, user)
	{
		req.flash('success', 'Profile saved!');
		res.redirect(req.originalUrl);
	});
});

function render(res, errors, success)
{
	if (typeof errors == "string")
	{
		errors = [{ msg:errors }];
	}
	res.render('profile', {
		errors: errors || [], 
		success: success || null
	});
}

module.exports = router;