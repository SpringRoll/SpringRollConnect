// Confirm action
$('[data-toggle="confirm"]').on('tap', function(e) {
  var message = $(this).data('message') || 'Are you sure?';
  if (!confirm(message)) {
    e.preventDefault();
  }
});
