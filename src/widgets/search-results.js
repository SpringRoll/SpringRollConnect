// Remove anything in the search results
$('.search-results').on('tap', 'button', function() {
  $(this)
    .closest('.search-result')
    .remove();
});
