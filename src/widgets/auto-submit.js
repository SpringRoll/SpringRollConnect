// Submit on change
$('.auto-submit').on('tap', function() {
  console.log('called');
  $(this)
    .closest('form')
    .submit();
});
