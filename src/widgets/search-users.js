(function() {
  // User searching add result
  var users = $('#users');
  var userTemplate = $('#userTemplate').html();
  $('#userSearch').on('search', function(_, user) {
    users.append(
      userTemplate
        .trim()
        .replace('%id%', user.id)
        .replace('%name%', user.name)
    );
  });
})();
