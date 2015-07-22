(function()
{
	// User searching add result
	var groups = $("#groups");
	var groupTemplate = $("#groupTemplate").html();
	var permissions = [
		"Read",
		"Write",
		"Admin"
	];
	$("#groupSearch").on('search', function(e, group)
	{
		var permission = parseInt($("input[name='selectPermission']:checked").val());
		groups.append(groupTemplate.trim()
			.replace("%id%", group._id)
			.replace("%name%", group.name)
			.replace("%permission%", permission)
			.replace("%label%", permissions[permission])
		);
	});
}());