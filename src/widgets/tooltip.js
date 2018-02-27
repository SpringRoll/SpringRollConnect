if (!('ontouchstart' in window))
{
	$('[data-toggle="tooltip"]').tooltip(
		{container: 'body'}
	);
}
