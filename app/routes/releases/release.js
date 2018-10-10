// This file will control the behavior of the following route:
// sr.pbk.org/releases/:commit_id
// GET - redirect to sr.pbk.org/games/:game_slug/releases/:commit_id
// POST - create resource and redirect to above
// PATCH - update resource and redirect to above
// DELETE - delete resource and redirect to sr.pbk.org/games/:game_slug/releases

var router = require('express').Router(),
	Game = require('../../models/game'),
	Release = require('../../models/release');
const { defaultCapabilities } = require('../games/helpers');

router.get('/:commit_id', async function(req, res)
{
	let release = await Release.getByCommitId(req.params.commit_id);
	let game = await Game.getById(release.game)
	let access = game.getAccess(req.user);
	res.render("games/release", {
		game: game,
		release: release,
		capabilities: release.capabilities,
		host: req.headers.host,
		isEditor: access.permission > 0,
		isAdmin: access.permission > 1,
		token: access.token,
		errors: req.flash('errors'),
		success: req.flash('success'),
		error: req.flash('error')
	});
});

router.patch('/:commit_id', function(req, res)
{
	req.checkBody('commitId', 'Commit is a Git hash').isCommit();
	req.checkBody('status', 'Status must be a valid status').isStatus();
	req.checkBody('notes').optional();

	if (req.body.version)
		req.checkBody('version', 'Version must be a valid semantic version').isSemver();

	defaultCapabilities(req.body.capabilities);

	var errors = req.validationErrors();

	if (errors) return done(errors);

	req.body.updated = Date.now();
	Release.findByIdAndUpdate(req.body.release, req.body)
	.then(() => {
		res.redirect('/releases/' + req.body.commitId);
	});
});

router.delete('/:commit_id', function(req, res)
{
	Release.removeById(req.body.release, function(err)
			{
				if (err) return done(err);
				req.flash('success', 'Deleted release');
				res.redirect('/games');
			});
});

module.exports = router;