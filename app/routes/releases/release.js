// This file will control the behavior of the following route:
// sr.pbk.org/releases/:commit_id
// GET - redirect to sr.pbk.org/games/:game_slug/releases/:commit_id
// POST - create resource and redirect to above
// PATCH - update resource and redirect to above
// DELETE - delete resource and redirect to sr.pbk.org/games/:game_slug/releases

router.get('/release/:commit_id', function(req, res)
{

});

router.post('/release/:commit_id', function(req, res)
{
	
});

router.patch('/release/:commit_id', function(req, res)
{
	
});

router.delete('/release/:commit_id', function(req, res)
{
	
});