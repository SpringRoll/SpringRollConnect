var router = require('express').Router();
var Config = require('../models/config');

router.get('/', function(req, res)
{
	res.render('configuration', 
	{
		error: req.flash('error'),
		errors: req.flash('errors'),
		success: req.flash('success')
	});
});

router.post('/', function(req, res)
{
	// Validation
	req.checkBody('devExpireDays', 'Dev Expires Days is required').isNumeric();
	req.checkBody('maxDevReleases', 'Maximum Dev Releases is required').isNumeric();

	if (req.body.embedScriptPlugin)
		req.checkBody('embedScriptPlugin', 'Embed Script Plugin must be a valid URL').isURL();

	if (req.body.embedCssPlugin)
		req.checkBody('embedCssPlugin', 'Embed CSS Plugin must be a valid URL').isURL();

	var errors = req.validationErrors();

	if (errors)
	{
		req.flash('errors', errors);
		res.redirect('/configuration');
		return;
	}

	var callback = function(err, config)
	{
		if (err)
		{
			req.flash('error', err);
		}
		else
		{
			req.flash('success', 'Configuration saved!');
		}
		res.redirect('/configuration');
	};

	if (req.body.id)
	{
		Config.findByIdAndUpdate(req.body.id, req.body, callback);
	}
	else
	{
		var config = new Config(req.body);
		global.CONFIGURATION = res.locals.config = config;
		config.save(callback);
	}
});

module.exports = router;