(function()
{
	// User searching add result
	var games = $("#games");
	var gameTemplate = $("#gameTemplate").html();
	$("#allGameSearch").on('search', function(e, game)
	{
		location.href = "/games/game/" + game.slug;
	});
}());