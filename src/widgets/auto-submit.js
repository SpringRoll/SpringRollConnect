// Submit on change
$('.auto-submit').on('tap', function() {
  $(this)
    .closest('form')
    .submit();
});
