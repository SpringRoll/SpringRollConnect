// Search for unique field
$('.form-group[data-unique]').each(function()
{
	var group = $(this);
	var search = group.data('unique');
	var ignore = group.data('ignore');
	var params = group.data('params') || {};
	group.find('input[type="text"]').on('change keyup', function()
	{
		var input = $(this);
		group.removeClass('has-feedback has-error has-success');
		if (input.val() && input.val() != ignore)
		{
			var vars = $.extend({}, params);
			vars[input.prop('name')] = this.value;
			$.post(search, vars, function(result)
			{
				if (input.val())
				{
					group.addClass('has-feedback')
						.addClass(!!result ? 'has-error' : 'has-success');
				}
			});
		}
	});
});