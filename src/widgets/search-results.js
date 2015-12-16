// Remove anything in the search results
$(".search-results").on('tap', 'button', function(e)
{
	$(this).closest('.search-result').remove();
});