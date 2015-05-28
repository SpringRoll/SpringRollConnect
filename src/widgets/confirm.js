// Confirm action
$('[data-toggle="confirm"]').click(function(e)
{
	var message = $(this).data('message') || "Are you sure?";
	if (!confirm(message))
	{
		e.preventDefault();
	}
});