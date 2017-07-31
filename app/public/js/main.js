(function($)
{
	/**
	 * Search setup
	 * @param  {object|Function} options The options or handler
	 * @param {string} [options.service] The service end-point to search
	 * @param {string} [options.list] The select where to add the contents to,
	 *        must contain a ul.
	 * @param {string} [options.selected] Handler when clicking on an item
	 * @param {string} [options.empty="No contents found"] Displayed when no result
	 * @param {string} [field="name"] The field of the content field to show
	 * @return {jquery} For chaining
	 */
	$.fn.search = function(settings)
	{
		// Short cut for options
		if (typeof options == "function")
			settings = { selected: settings };

		// Default options
		var options = $.extend({
			field: "name",
			empty: "No contents founds",
			autoClear: true
		}, settings);

		return this.each(function(){

			var input = $(this);
			var container = $(input.data('list') || options.list);
			var field = input.data('field') || options.field;
			var list = container.find("ul");

			var onSearchClicked = function(e)
			{
				e.preventDefault();
				var content = $(this).data('content');

				if (options.selected)
					options.selected(content);

				input.trigger('search', content);
				container.removeClass('open');

				if (options.autoClear)
				{
					clear();
				}
			};

			var clear = function()
			{
				input.val("");
				list.find('.search-item').off('tap');
				list.empty();
				container.removeClass('open');
			};

			var onSearchResults = function(contents)
			{
				if (!contents) return;

				container.addClass('open');

				if (!contents.length)
				{
					list.html("<li class='empty'>" + options.empty + "</li>");
				}
				else
				{
					var items = [];
					var item;
					var search = input.val();
					for (var i = 0; i < contents.length; i++)
					{
						var content = contents[i];
						item = $("<li><button class='btn btn-link search-item'></button></li>");
						item.find('button')
							.html(content[field].replace(
								new RegExp("("+ search + ")", "i"), 
								"<strong>$1</strong>"
							))
							.data('content', content);
						items.push(item);
					}
					list.html(items);
					list.find('.search-item').on('tap', onSearchClicked);
				}
			};
			input.keydown(function(e){
				// Stop the enter key press
				if (e.keyCode == 13)
				{
					e.preventDefault();
				}
			})
			.keyup(function(e)
			{
				var active = list.find('.active');
				if (e.keyCode == 38) // up
				{
					if (active.length)
					{
						active.removeClass('active')
							.prev().addClass('active');
					}
					e.preventDefault();
				}
				else if (e.keyCode == 40) // down
				{
					if (active.length)
					{
						active.removeClass('active')
							.next().addClass('active');
					}
					else
					{
						list.find('li:first').addClass('active');
					}
					e.preventDefault();
				}
				else if (e.keyCode == 13) //enter
				{
					if (active.length)
					{
						active.find('.search-item').tap();
						e.preventDefault();
					}
					else if (options.enterPress && this.value)
					{
						options.enterPress.call(this);
						e.preventDefault();
						clear();
					}
				}
				else
				{
					if (!this.value)
					{
						clear();
					}
					else
					{
						$.post(
							input.data('search') || options.service, 
							{ search: this.value },
							onSearchResults
						);
					}
				}				
			}).focus(function(event)
			{
				// Is there at least one li for the current search?
				// If not, don't open until user starts typing
				if (list.find("li").length)
				{
					container.addClass('open');
				}
			}).blur(function(event)
			{
				if (!$(event.relatedTarget).hasClass('search-item'))
				{
					container.removeClass('open');
				}
			});
		});
	};

}(jQuery));
// Auto fill the uri slug on input
$('[data-uri]').each(function()
{
	var source = $(this);
	var target = $(source.data('uri'));
	source.keyup(function()
	{
		target.val(this.value
			.toLowerCase()
			.replace(/ /g, '-')
			.replace(/[^a-z0-9\-]/g, '')
		);
	});
});
// Submit on change
$('.auto-submit').on('tap', function()
{
	$(this).closest('form').submit();
});
$('textarea.autogrow').autoGrow();
/*
	.empty.base64(data-limit="60000" data-width="200" data-height="100")
		button.select.btn.btn-default.btn-sm(type="button" data-toggle="popover" data-trigger="manual" data-content="PNG or JPG 200px by 100px less than 60KB") Select Thumbnail
		input.input.hidden(type="file" accept="image/jpeg, image/png")
		button.btn.btn-default.btn-sm.reset(type="button") &times;
		img.preview(width="200" height="100")
		input.output(type="hidden" name="fileData")
*/
$(".base64").each(function()
{
	var container = $(this);
	var button = container.find('.select');
	var input = container.find('.input');
	var close = container.find('.reset');
	var output = container.find('.output');
	var preview = container.find('.preview');
	var limit = parseInt(container.data('limit'));
	var width = parseInt(container.data('width'));
	var height = parseInt(container.data('height'));

	function reset()
	{
		input.val(""); 
		output.val("");
		preview.attr('src', "");
		container.addClass('empty');
	}

	input.change(function(e)
	{
		var files = e.target.files;
		if (files && files.length)
		{
			var file = files[0];
			if (file.size > limit)
			{
				console.log("Over the size limit %d, expecting less than %d", file.size, limit);
				reset();
				button.popover('show');
				return;
			}

			var reader = new FileReader();
			reader.onload = function(readerEvt)
			{
				var binaryString = readerEvt.target.result;
				var input_size = binaryString.length;
				var str = btoa(binaryString);
				output.val(str);
				preview.attr('src', 'data:image/png;base64,' + str);
			};
			reader.readAsBinaryString(file);
		}
	});

	preview.on('load', function()
	{
		if (width != this.naturalWidth || height != this.naturalHeight)
		{
			console.log("Incorrect dimensions, expecting (" + width + ", " + height + ") got (" + this.naturalWidth + ", " + this.naturalHeight + ")");
			reset();
			button.popover('show');
		}
		else
		{
			container.removeClass('empty');
		}
	});

	close.click(function()
	{
		reset();
	});

	button.click(function()
	{
		button.popover('hide');
		input.click();
	});

	if (container.hasClass('empty'))
	{
		reset();
	}
});
// Confirm action
$('[data-toggle="confirm"]').on('tap', function(e)
{
	var message = $(this).data('message') || "Are you sure?";
	if (!confirm(message))
	{
		e.preventDefault();
	}
});
// Submit on change
$('select.content-select').change(function()
{
	if (this.value)
		$(this).closest('form').submit();
});
$("a.external").attr("target","_blank");
$('[data-toggle="popover"]').popover();
$(".statusChange-menu a").on('tap', function(e)
{
	$(this).find('input[type="radio"]')
		.prop('checked', true)
		.closest("form")
		.submit();
		
	e.preventDefault();
});
(function()
{
	// User searching add result
	var games = $("#games");
	var gameTemplate = $("#gameTemplate").html();
	$("#allGameSearch").on('search', function(e, game)
	{
		location.href = "/games/game/" + game.slug;
	});
}());
(function()
{
	// User searching add result
	var games = $("#games");
	var gameTemplate = $("#gameTemplate").html();
	$("#gameSearch").on('search', function(e, game)
	{
		games.append(gameTemplate.trim()
			.replace("%id%", game._id)
			.replace("%title%", game.title)
		);
	});
}());
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
// Remove anything in the search results
$(".search-results").on('tap', 'button', function(e)
{
	$(this).closest('.search-result').remove();
});
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
// Search functionality
$("[data-search]").search();
// Auto select the input field
$('.select-all').on('tap', function()
{
	$(this).select();
});
if (!Modernizr.touch)
{
	$('[data-toggle="tooltip"]').tooltip(
		{container: 'body'}
	);
}
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
//# sourceMappingURL=main.js.map