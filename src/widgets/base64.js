/*
	.empty.base64(data-limit="60000" data-width="200" data-height="100")
		button.select.btn.btn-default.btn-sm(type="button" data-toggle="popover" data-trigger="manual" data-content="PNG or JPG 200px by 100px less than 60KB") Select Thumbnail
		input.input.hidden(type="file" accept="image/jpeg, image/png")
		button.btn.btn-default.btn-sm.reset(type="button") &times;
		img.preview(width="200" height="100")
		input.output(type="hidden" name="fileData")
*/
$('.base64').each(function() {
  var container = $(this);
  var button = container.find('.select');
  var input = container.find('.input');
  var close = container.find('.reset');
  var output = container.find('.output');
  var preview = container.find('.preview');
  var limit = parseInt(container.data('limit'));
  var width = parseInt(container.data('width'));
  var height = parseInt(container.data('height'));

  function reset() {
    input.val('');
    output.val('');
    preview.attr('src', '');
    container.addClass('empty');
  }

  input.change(function(e) {
    var files = e.target['files'];
    if (files && files.length) {
      var file = files[0];
      if (file.size > limit) {
        console.log(
          'Over the size limit %d, expecting less than %d',
          file.size,
          limit
        );
        reset();
        button.popover('show');
        return;
      }

      var reader = new FileReader();
      reader.onload = function(readerEvt) {
        var binaryString = readerEvt.target['result'];
        // var input_size = binaryString.length;
        var str = btoa(binaryString);
        output.val(str);
        preview.attr('src', 'data:image/png;base64,' + str);
      };
      reader.readAsBinaryString(file);
    }
  });

  preview.on('load', function() {
    if (width != this['naturalWidth'] || height != this['naturalHeight']) {
      console.log(
        'Incorrect dimensions, expecting (' +
          width +
          ', ' +
          height +
          ') got (' +
          this['naturalWidth'] +
          ', ' +
          this['naturalHeight'] +
          ')'
      );
      reset();
      button.popover('show');
    } else {
      container.removeClass('empty');
    }
  });

  close.click(function() {
    reset();
  });

  button.click(function() {
    button.popover('hide');
    input.click();
  });

  if (container.hasClass('empty')) {
    reset();
  }
});
