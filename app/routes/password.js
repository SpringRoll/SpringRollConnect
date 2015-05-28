var router = require('express').Router();

router.get('/', function(req, res)
{
	render(res, null, req.flash('success'));
});

router.post('/', function(req, res)
{
	req.checkBody('oldPassword', 'Current Password is required.').notEmpty();
	req.checkBody('newPassword', 'New Password is required.').notEmpty();
	req.checkBody('repeatPassword', 'Repeat Password must be equal to New Password.')
		.equals(req.body.newPassword);

	var errors = req.validationErrors() || [];
	
	if (!req.user.comparePassword(req.body.oldPassword))
	{
		errors.push({ msg: 'Current password is invalid.' });
	}

	if (errors.length)
	{
		render(res, errors);
		return;
	}

	req.user.password = req.body.newPassword;

	req.user.save(
		function(err, user)
		{
			req.flash('success', 'Password updated!');
			res.redirect(req.originalUrl);
		}
	);	
});

function render(res, errors, success)
{
	if (typeof errors == "string")
	{
		errors = [{ msg:errors }];
	}
	res.render('password', {
		errors: errors || [],
		success: success || null
	});
}

module.exports = router;