(function($) {
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
  $.fn.search = function(settings) {
    // Short cut for options
    if (typeof options == 'function') settings = { selected: settings };

    // Default options
    var options = $.extend(
      {
        field: 'name',
        empty: 'No contents founds',
        autoClear: true
      },
      settings
    );

    return this.each(function() {
      var input = $(this);
      var container = $(input.data('list') || options.list);
      var field = input.data('field') || options.field;
      var list = container.find('ul');

      var onSearchClicked = function(e) {
        e.preventDefault();
        var content = $(this).data('content');

        if (options.selected) options.selected(content);

        input.trigger('search', content);
        container.removeClass('open');

        if (options.autoClear) {
          clear();
        }
      };

      var clear = function() {
        input.val('');
        list.find('.search-item').off('tap');
        list.empty();
        container.removeClass('open');
      };

      var onSearchResults = function(contents) {
        if (!contents) return;

        container.addClass('open');

        if (!contents.length) {
          list.html("<li class='empty'>" + options.empty + '</li>');
        } else {
          var items = [];
          var item;
          var search = input.val();
          for (var i = 0; i < contents.length; i++) {
            var content = contents[i];
            item = $(
              "<li><button class='btn btn-link search-item'></button></li>"
            );
            item
              .find('button')
              .html(
                content[field].replace(
                  new RegExp('(' + search + ')', 'i'),
                  '<strong>$1</strong>'
                )
              )
              .data('content', content);
            items.push(item);
          }
          list.html(items);
          list.find('.search-item').on('tap', onSearchClicked);
        }
      };
      input
        .keydown(function(e) {
          // Stop the enter key press
          if (e.keyCode == 13) {
            e.preventDefault();
          }
        })
        .keyup(function(e) {
          var active = list.find('.active');
          if (e.keyCode == 38) {
            // up
            if (active.length) {
              active
                .removeClass('active')
                .prev()
                .addClass('active');
            }
            e.preventDefault();
          } else if (e.keyCode == 40) {
            // down
            if (active.length) {
              active
                .removeClass('active')
                .next()
                .addClass('active');
            } else {
              list.find('li:first').addClass('active');
            }
            e.preventDefault();
          } else if (e.keyCode == 13) {
            //enter
            if (active.length) {
              active.find('.search-item').tap();
              e.preventDefault();
            } else if (options.enterPress && this.value) {
              options.enterPress.call(this);
              e.preventDefault();
              clear();
            }
          } else {
            if (!this.value) {
              clear();
            } else {
              $.post(
                input.data('search') || options.service,
                { search: this.value },
                onSearchResults
              );
            }
          }
        })
        .focus(function(event) {
          // Is there at least one li for the current search?
          // If not, don't open until user starts typing
          if (list.find('li').length) {
            container.addClass('open');
          }
        })
        .blur(function(event) {
          if (!$(event.relatedTarget).hasClass('search-item')) {
            container.removeClass('open');
          }
        });
    });
  };
})(jQuery);
