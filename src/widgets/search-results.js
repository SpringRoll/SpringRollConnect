// Remove anything in the search results
$(".search-results").on('click', 'button', function(e)
{
	$(this).closest('.search-result').remove();
});