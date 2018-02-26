var glob = require('glob');
var gruntConfig = require('./config');
var taskAliases = require('./aliases');

// Takes a raw file list, potentially containing globs, and expands it into a list with no globs
var expandFileList = function(rawFileList) {
  var expandedList = [];
  rawFileList.forEach(function(filename) {
    glob.sync(filename).forEach(function(expandedFileName) {
      expandedList.push(expandedFileName);
    }); 
  });
  return expandedList
}

// Returns a function that tests if files have a certain extension
var hasExtension = function(extension) {
  var regex = new RegExp('\\.' + extension + '$');
  return function(filename) {
    return regex.test(filename);
  };
};

// takes a module name and a list of files and builds out tasks for building that module
module.exports = function(name, fileList) {
  var expanded = expandFileList(fileList);
  var jsFiles = expanded.filter(hasExtension('js'));
  var lessFiles = expanded.filter(hasExtension('less'));
  var cssFiles = expanded.filter(hasExtension('css'));

  // if the file list has any JS files, build out the relevant tasks for it
  if(jsFiles.length > 0) {
    gruntConfig.concat[name] = {
      src: jsFiles,
      dest: 'app/public/js/' + name + '.js'
    };

    taskAliases.default.push('concat:' + name);
    taskAliases.debug.push('concat:' + name);
  }

  // if there are any less files, build out compilation for them too
  if(lessFiles.length > 0) {
    gruntConfig.less[name] = { files: {} };
    gruntConfig.less[name].files['app/public/css/' + name + '.css'] = lessFiles[0];

    taskAliases.default.push('less:' + name);
    taskAliases.debug.push('less:' + name);
  }

  // If there are any css files, build out concat tasks for them
  if(cssFiles.length > 0) {
    gruntConfig.concat[name + '.css'] = {
      src: cssFiles,
      dest: 'app/public/css/' + name + '.css'
    };

    taskAliases.default.push('concat:' + name + '.css');
    taskAliases.debug.push('concat:' + name + '.css');
  }
}
