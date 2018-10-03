// This file will control the behavior of the following route:
// sr.pbk.org/releases/:commit_id
// GET - redirect to sr.pbk.org/games/:game_slug/releases/:commit_id
// POST - create resource and redirect to above
// PATCH - update resource and redirect to above
// DELETE - delete resource and redirect to sr.pbk.org/games/:game_slug/releases

router.get('/release/:commit_id', function(req, res)
{
	postPage(req, res, privileges.editor,
	{
		removeRelease: function(done)
		{
			Release.removeById(
				req.body.release,
				done
			);
		},
		statusChange: function(done)
		{
			Release.findByIdAndUpdate(
				req.body.release,
				{
					status: req.body.status,
					updated: Date.now(),
					updatedBy: req.body.updatedBy
				},
				done
			);
		}
	});
});

router.post('/release/:commit_id', function(req, res)
{
	postPage(req, res, privileges.editor,
	{
		selectRelease: function(done, game, access)
		{
			Release.getById(req.body.release, function(err, release)
			{
				if (err) return done(err);

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
		},
		removeRelease: function(done, game)
		{
			Release.removeById(req.body.release, function(err)
			{
				if (err) return done(err);
				req.flash('success', 'Deleted release');
				res.redirect('/games/game/' + game.slug + '/releases');
			});
		},
		updateRelease: function(done, game)
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
			Release.findByIdAndUpdate(req.body.release, req.body, done);
		}
	});
});