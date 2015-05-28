$(".statusChange-menu a").click(function(e)
{
	$(this).find('input[type="radio"]')
		.prop('checked', true)
		.closest("form")
		.submit();
		
	e.preventDefault();
});