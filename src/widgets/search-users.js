(function()
{
	// User searching add result
	var users = $("#users");
	var userTemplate = $("#userTemplate").html();
	$("#userSearch").on('search', function(e, user)
	{
		users.append(userTemplate.trim()
			.replace("%id%", user._id)
			.replace("%name%", user.name)
		);
	});
}());