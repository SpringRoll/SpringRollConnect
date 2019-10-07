// Submit on change
$('select.content-select').change(function() {
  if (this['value'])
    $(this)
      .closest('form')
      .submit();
});
