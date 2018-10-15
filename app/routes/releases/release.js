var router = require('express').Router(),
	Game = require('../../models/game'),
	Release = require('../../models/release');
const { defaultCapabilities, handleError } = require('../games/helpers');

router.get('/:commit_id', async function(req, res)
{
	let release = await Release.getByCommitId(req.params.commit_id);
	let game = await Game.getById(release.game);
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

router.patch('/:commit_id', async function(req, res)
{
	req.checkBody('commitId', 'Commit is a Git hash').isCommit();
	req.checkBody('status', 'Status must be a valid status').isStatus();
	req.checkBody('notes').optional();

	if (req.body.version)
		req.checkBody('version', 'Version must be a valid semantic version').isSemver();

	if(req.body.capabilities){
		defaultCapabilities(req.body.capabilities);
	}

	var errors = req.validationErrors();

	if (errors) return handleError(errors);

	req.body.updated = Date.now();
	await Release.findByIdAndUpdate(req.body.release, req.body);
	let release = await Release.getByCommitId(req.body.commitId);
	let game = await Game.getById(release.game);
	let baseUrl = '';
	if (!game.isArchived){
		baseUrl = '/games';
	}
	else {
		baseUrl = '/archive';
	}
	res.redirect(baseUrl + '/' + game.slug + '/releases');
});

router.delete('/:commit_id', function(req, res)
{
	Release.removeById(req.body.release, async function(err)
			{
				if (err) return handleError(err);
				req.flash('success', 'Deleted release');
				let release = await Release.getByCommitId(req.body.commitId);
				let game = await Game.getById(release.game);
				let baseUrl = '';
				if (!game.isArchived){
					baseUrl = '/games';
				}
				else {
					baseUrl = '/archive';
				}
				res.redirect(baseUrl + '/' + game.slug + '/releases');
			});
});

module.exports = router;