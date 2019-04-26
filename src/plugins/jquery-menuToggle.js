(function($) {
  // The currently opened drop down
  var currDropdown = null;

  /**
   * Dropdown setup
   * @return {jquery} For chaining
   */
  $.fn.menuToggle = function() {
    return this.each(function() {
      var toggle = $(this);
      var selector = toggle.data('toggle-div');
      var dropdown = $(selector);
      toggle.off('tap hover').on('tap hover', function(e) {
        var showing = dropdown.hasClass('on');
        if (currDropdown) currDropdown.removeClass('on');
        if (!showing) {
          dropdown.addClass('on');
          currDropdown = dropdown;
        }
      });
    });
  };
})(jQuery);
