// Auto fill the uri slug on input
$('[data-uri]').each(function() {
  var source = $(this);
  var target = $(source.data('uri'));
  source.keyup(function() {
    target.val(
      this['value']
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^a-z0-9\-]/g, '')
    );
  });
});
