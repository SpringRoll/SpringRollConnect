(function() {
  // User searching add result
  var games = $('#games');
  var gameTemplate = $('#gameTemplate').html();
  $('#gameSearch').on('search', function(_, game) {
    games.append(
      gameTemplate
        .trim()
        .replace('%id%', game.slug)
        .replace('%title%', game.title)
    );
  });
})();
