(function() {
  // User searching add result
  var groups = $('#groups');
  var groupTemplate = $('#groupTemplate').html();
  var permissions = ['Read', 'Write', 'Admin'];
  $('#groupSearch').on('search', function(_, group) {
    var permission = parseInt(
      // @ts-ignore
      $("input[name='selectPermission']:checked").val()
    );
    groups.append(
      groupTemplate
        .trim()
        .replace('%id%', group.id)
        .replace('%name%', group.name)
        // @ts-ignore
        .replace('%permission%', permission)
        .replace('%label%', permissions[permission])
    );
  });
})();
