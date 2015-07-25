if (!Modernizr.touch)
{
	$('[data-toggle="tooltip"]').tooltip(
		{container: 'body'}
	);
}