/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _widgets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./widgets */ \"./src/widgets/index.js\");\n/* harmony import */ var _plugins_jquery_search__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./plugins/jquery-search */ \"./src/plugins/jquery-search.js\");\n/* harmony import */ var _plugins_jquery_search__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_plugins_jquery_search__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _main_less__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./main.less */ \"./src/main.less\");\n/* harmony import */ var _main_less__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_main_less__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/main.less":
/*!***********************!*\
  !*** ./src/main.less ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/main.less?");

/***/ }),

/***/ "./src/plugins/jquery-search.js":
/*!**************************************!*\
  !*** ./src/plugins/jquery-search.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function($) {\n  /**\n   * Search setup\n   * @param  {object|Function} options The options or handler\n   * @param {string} [options.service] The service end-point to search\n   * @param {string} [options.list] The select where to add the contents to,\n   *        must contain a ul.\n   * @param {string} [options.selected] Handler when clicking on an item\n   * @param {string} [options.empty=\"No contents found\"] Displayed when no result\n   * @param {string} [field=\"name\"] The field of the content field to show\n   * @return {jquery} For chaining\n   */\n  $.fn.search = function(settings) {\n    // Short cut for options\n    if (typeof options == 'function') settings = { selected: settings };\n\n    // Default options\n    var options = $.extend(\n      {\n        field: 'name',\n        empty: 'No contents founds',\n        autoClear: true\n      },\n      settings\n    );\n\n    return this.each(function() {\n      var input = $(this);\n      var container = $(input.data('list') || options.list);\n      var field = input.data('field') || options.field;\n      var list = container.find('ul');\n\n      var onSearchClicked = function(e) {\n        e.preventDefault();\n        var content = $(this).data('content');\n\n        if (options.selected) options.selected(content);\n\n        input.trigger('search', content);\n        container.removeClass('open');\n\n        if (options.autoClear) {\n          clear();\n        }\n      };\n\n      var clear = function() {\n        input.val('');\n        list.find('.search-item').off('tap');\n        list.empty();\n        container.removeClass('open');\n      };\n\n      var onSearchResults = function(contents) {\n        if (!contents) return;\n\n        container.addClass('open');\n\n        if (!contents.length) {\n          list.html(\"<li class='empty'>\" + options.empty + '</li>');\n        } else {\n          var items = [];\n          var item;\n          var search = input.val();\n          for (var i = 0; i < contents.length; i++) {\n            var content = contents[i];\n            item = $(\n              \"<li><button class='btn btn-link search-item'></button></li>\"\n            );\n            item\n              .find('button')\n              .html(\n                content[field].replace(\n                  new RegExp('(' + search + ')', 'i'),\n                  '<strong>$1</strong>'\n                )\n              )\n              .data('content', content);\n            items.push(item);\n          }\n          list.html(items);\n          list.find('.search-item').on('tap', onSearchClicked);\n        }\n      };\n      input\n        .keydown(function(e) {\n          // Stop the enter key press\n          if (e.keyCode == 13) {\n            e.preventDefault();\n          }\n        })\n        .keyup(function(e) {\n          var active = list.find('.active');\n          if (e.keyCode == 38) {\n            // up\n            if (active.length) {\n              active\n                .removeClass('active')\n                .prev()\n                .addClass('active');\n            }\n            e.preventDefault();\n          } else if (e.keyCode == 40) {\n            // down\n            if (active.length) {\n              active\n                .removeClass('active')\n                .next()\n                .addClass('active');\n            } else {\n              list.find('li:first').addClass('active');\n            }\n            e.preventDefault();\n          } else if (e.keyCode == 13) {\n            //enter\n            if (active.length) {\n              active.find('.search-item').tap();\n              e.preventDefault();\n            } else if (options.enterPress && this.value) {\n              options.enterPress.call(this);\n              e.preventDefault();\n              clear();\n            }\n          } else {\n            if (!this.value) {\n              clear();\n            } else {\n              $.post(\n                input.data('search') || options.service,\n                { search: this.value },\n                onSearchResults\n              );\n            }\n          }\n        })\n        .focus(function(event) {\n          // Is there at least one li for the current search?\n          // If not, don't open until user starts typing\n          if (list.find('li').length) {\n            container.addClass('open');\n          }\n        })\n        .blur(function(event) {\n          if (!$(event.relatedTarget).hasClass('search-item')) {\n            container.removeClass('open');\n          }\n        });\n    });\n  };\n})(jQuery);\n\n\n//# sourceURL=webpack:///./src/plugins/jquery-search.js?");

/***/ }),

/***/ "./src/widgets/auto-slug.js":
/*!**********************************!*\
  !*** ./src/widgets/auto-slug.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Auto fill the uri slug on input\n$('[data-uri]').each(function() {\n  var source = $(this);\n  var target = $(source.data('uri'));\n  source.keyup(function() {\n    target.val(\n      this['value']\n        .toLowerCase()\n        .replace(/ /g, '-')\n        .replace(/[^a-z0-9\\-]/g, '')\n    );\n  });\n});\n\n\n//# sourceURL=webpack:///./src/widgets/auto-slug.js?");

/***/ }),

/***/ "./src/widgets/auto-submit.js":
/*!************************************!*\
  !*** ./src/widgets/auto-submit.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Submit on change\n$('.auto-submit').on('tap', function() {\n  $(this)\n    .closest('form')\n    .submit();\n});\n\n\n//# sourceURL=webpack:///./src/widgets/auto-submit.js?");

/***/ }),

/***/ "./src/widgets/autogrow.js":
/*!*********************************!*\
  !*** ./src/widgets/autogrow.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("$('textarea.autogrow')['autoGrow']();\n\n\n//# sourceURL=webpack:///./src/widgets/autogrow.js?");

/***/ }),

/***/ "./src/widgets/base64.js":
/*!*******************************!*\
  !*** ./src/widgets/base64.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/*\n\t.empty.base64(data-limit=\"60000\" data-width=\"200\" data-height=\"100\")\n\t\tbutton.select.btn.btn-default.btn-sm(type=\"button\" data-toggle=\"popover\" data-trigger=\"manual\" data-content=\"PNG or JPG 200px by 100px less than 60KB\") Select Thumbnail\n\t\tinput.input.hidden(type=\"file\" accept=\"image/jpeg, image/png\")\n\t\tbutton.btn.btn-default.btn-sm.reset(type=\"button\") &times;\n\t\timg.preview(width=\"200\" height=\"100\")\n\t\tinput.output(type=\"hidden\" name=\"fileData\")\n*/\n$('.base64').each(function() {\n  var container = $(this);\n  var button = container.find('.select');\n  var input = container.find('.input');\n  var close = container.find('.reset');\n  var output = container.find('.output');\n  var preview = container.find('.preview');\n  var limit = parseInt(container.data('limit'));\n  var width = parseInt(container.data('width'));\n  var height = parseInt(container.data('height'));\n\n  function reset() {\n    input.val('');\n    output.val('');\n    preview.attr('src', '');\n    container.addClass('empty');\n  }\n\n  input.change(function(e) {\n    var files = e.target['files'];\n    if (files && files.length) {\n      var file = files[0];\n      if (file.size > limit) {\n        console.log(\n          'Over the size limit %d, expecting less than %d',\n          file.size,\n          limit\n        );\n        reset();\n        button.popover('show');\n        return;\n      }\n\n      var reader = new FileReader();\n      reader.onload = function(readerEvt) {\n        var binaryString = readerEvt.target['result'];\n        // var input_size = binaryString.length;\n        var str = btoa(binaryString);\n        output.val(str);\n        preview.attr('src', 'data:image/png;base64,' + str);\n      };\n      reader.readAsBinaryString(file);\n    }\n  });\n\n  preview.on('load', function() {\n    if (width != this['naturalWidth'] || height != this['naturalHeight']) {\n      console.log(\n        'Incorrect dimensions, expecting (' +\n          width +\n          ', ' +\n          height +\n          ') got (' +\n          this['naturalWidth'] +\n          ', ' +\n          this['naturalHeight'] +\n          ')'\n      );\n      reset();\n      button.popover('show');\n    } else {\n      container.removeClass('empty');\n    }\n  });\n\n  close.click(function() {\n    reset();\n  });\n\n  button.click(function() {\n    button.popover('hide');\n    input.click();\n  });\n\n  if (container.hasClass('empty')) {\n    reset();\n  }\n});\n\n\n//# sourceURL=webpack:///./src/widgets/base64.js?");

/***/ }),

/***/ "./src/widgets/confirm.js":
/*!********************************!*\
  !*** ./src/widgets/confirm.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Confirm action\n$('[data-toggle=\"confirm\"]').on('tap', function(e) {\n  var message = $(this).data('message') || 'Are you sure?';\n  if (!confirm(message)) {\n    e.preventDefault();\n  }\n});\n\n\n//# sourceURL=webpack:///./src/widgets/confirm.js?");

/***/ }),

/***/ "./src/widgets/content-select.js":
/*!***************************************!*\
  !*** ./src/widgets/content-select.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Submit on change\n$('select.content-select').change(function() {\n  if (this['value'])\n    $(this)\n      .closest('form')\n      .submit();\n});\n\n\n//# sourceURL=webpack:///./src/widgets/content-select.js?");

/***/ }),

/***/ "./src/widgets/external.js":
/*!*********************************!*\
  !*** ./src/widgets/external.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("$('a.external').attr('target', '_blank');\n\n\n//# sourceURL=webpack:///./src/widgets/external.js?");

/***/ }),

/***/ "./src/widgets/index.js":
/*!******************************!*\
  !*** ./src/widgets/index.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _auto_slug__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./auto-slug */ \"./src/widgets/auto-slug.js\");\n/* harmony import */ var _auto_slug__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_auto_slug__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _auto_submit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auto-submit */ \"./src/widgets/auto-submit.js\");\n/* harmony import */ var _auto_submit__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_auto_submit__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _autogrow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./autogrow */ \"./src/widgets/autogrow.js\");\n/* harmony import */ var _autogrow__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_autogrow__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _base64__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./base64 */ \"./src/widgets/base64.js\");\n/* harmony import */ var _base64__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_base64__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _confirm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./confirm */ \"./src/widgets/confirm.js\");\n/* harmony import */ var _confirm__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_confirm__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _content_select__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./content-select */ \"./src/widgets/content-select.js\");\n/* harmony import */ var _content_select__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_content_select__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _external__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./external */ \"./src/widgets/external.js\");\n/* harmony import */ var _external__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_external__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var _popover__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./popover */ \"./src/widgets/popover.js\");\n/* harmony import */ var _popover__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_popover__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var _release_status__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./release-status */ \"./src/widgets/release-status.js\");\n/* harmony import */ var _release_status__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_release_status__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _search_games_all__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./search-games-all */ \"./src/widgets/search-games-all.js\");\n/* harmony import */ var _search_games_all__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_search_games_all__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var _search_games__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./search-games */ \"./src/widgets/search-games.js\");\n/* harmony import */ var _search_games__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_search_games__WEBPACK_IMPORTED_MODULE_10__);\n/* harmony import */ var _search_groups__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./search-groups */ \"./src/widgets/search-groups.js\");\n/* harmony import */ var _search_groups__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_search_groups__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var _search_results__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./search-results */ \"./src/widgets/search-results.js\");\n/* harmony import */ var _search_results__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_search_results__WEBPACK_IMPORTED_MODULE_12__);\n/* harmony import */ var _search_users__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./search-users */ \"./src/widgets/search-users.js\");\n/* harmony import */ var _search_users__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(_search_users__WEBPACK_IMPORTED_MODULE_13__);\n/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./search */ \"./src/widgets/search.js\");\n/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_search__WEBPACK_IMPORTED_MODULE_14__);\n/* harmony import */ var _select_all__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./select-all */ \"./src/widgets/select-all.js\");\n/* harmony import */ var _select_all__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(_select_all__WEBPACK_IMPORTED_MODULE_15__);\n/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./tooltip */ \"./src/widgets/tooltip.js\");\n/* harmony import */ var _tooltip__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_tooltip__WEBPACK_IMPORTED_MODULE_16__);\n/* harmony import */ var _unique__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./unique */ \"./src/widgets/unique.js\");\n/* harmony import */ var _unique__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_unique__WEBPACK_IMPORTED_MODULE_17__);\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./src/widgets/index.js?");

/***/ }),

/***/ "./src/widgets/popover.js":
/*!********************************!*\
  !*** ./src/widgets/popover.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("$('[data-toggle=\"popover\"]').popover();\n\n\n//# sourceURL=webpack:///./src/widgets/popover.js?");

/***/ }),

/***/ "./src/widgets/release-status.js":
/*!***************************************!*\
  !*** ./src/widgets/release-status.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("$('.statusChange-menu a').on('tap', function(e) {\n  $(this)\n    .find('input[type=\"radio\"]')\n    .prop('checked', true)\n    .closest('form')\n    .submit();\n\n  e.preventDefault();\n});\n\n\n//# sourceURL=webpack:///./src/widgets/release-status.js?");

/***/ }),

/***/ "./src/widgets/search-games-all.js":
/*!*****************************************!*\
  !*** ./src/widgets/search-games-all.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function() {\n  // User searching add result\n  // var games = $('#games');\n  // var gameTemplate = $('#gameTemplate').html();\n  $('#allGameSearch').on('search', function(_, game) {\n    window.location.href = game.url + game.slug;\n  });\n})();\n\n\n//# sourceURL=webpack:///./src/widgets/search-games-all.js?");

/***/ }),

/***/ "./src/widgets/search-games.js":
/*!*************************************!*\
  !*** ./src/widgets/search-games.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function() {\n  // User searching add result\n  var games = $('#games');\n  var gameTemplate = $('#gameTemplate').html();\n  $('#gameSearch').on('search', function(_, game) {\n    games.append(\n      gameTemplate\n        .trim()\n        .replace('%id%', game._id)\n        .replace('%title%', game.title)\n    );\n  });\n})();\n\n\n//# sourceURL=webpack:///./src/widgets/search-games.js?");

/***/ }),

/***/ "./src/widgets/search-groups.js":
/*!**************************************!*\
  !*** ./src/widgets/search-groups.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function() {\n  // User searching add result\n  var groups = $('#groups');\n  var groupTemplate = $('#groupTemplate').html();\n  var permissions = ['Read', 'Write', 'Admin'];\n  $('#groupSearch').on('search', function(_, group) {\n    var permission = parseInt(\n      // @ts-ignore\n      $(\"input[name='selectPermission']:checked\").val()\n    );\n    groups.append(\n      groupTemplate\n        .trim()\n        .replace('%id%', group._id)\n        .replace('%name%', group.name)\n        // @ts-ignore\n        .replace('%permission%', permission)\n        .replace('%label%', permissions[permission])\n    );\n  });\n})();\n\n\n//# sourceURL=webpack:///./src/widgets/search-groups.js?");

/***/ }),

/***/ "./src/widgets/search-results.js":
/*!***************************************!*\
  !*** ./src/widgets/search-results.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Remove anything in the search results\n$('.search-results').on('tap', 'button', function() {\n  $(this)\n    .closest('.search-result')\n    .remove();\n});\n\n\n//# sourceURL=webpack:///./src/widgets/search-results.js?");

/***/ }),

/***/ "./src/widgets/search-users.js":
/*!*************************************!*\
  !*** ./src/widgets/search-users.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("(function() {\n  // User searching add result\n  var users = $('#users');\n  var userTemplate = $('#userTemplate').html();\n  $('#userSearch').on('search', function(_, user) {\n    users.append(\n      userTemplate\n        .trim()\n        .replace('%id%', user._id)\n        .replace('%name%', user.name)\n    );\n  });\n})();\n\n\n//# sourceURL=webpack:///./src/widgets/search-users.js?");

/***/ }),

/***/ "./src/widgets/search.js":
/*!*******************************!*\
  !*** ./src/widgets/search.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Search functionality\n$('[data-search]')['search']();\n\n\n//# sourceURL=webpack:///./src/widgets/search.js?");

/***/ }),

/***/ "./src/widgets/select-all.js":
/*!***********************************!*\
  !*** ./src/widgets/select-all.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Auto select the input field\n$('.select-all').on('tap', function() {\n  $(this).select();\n});\n\n\n//# sourceURL=webpack:///./src/widgets/select-all.js?");

/***/ }),

/***/ "./src/widgets/tooltip.js":
/*!********************************!*\
  !*** ./src/widgets/tooltip.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("if (!('ontouchstart' in window)) {\n  $('[data-toggle=\"tooltip\"]').tooltip({ container: 'body' });\n}\n\n\n//# sourceURL=webpack:///./src/widgets/tooltip.js?");

/***/ }),

/***/ "./src/widgets/unique.js":
/*!*******************************!*\
  !*** ./src/widgets/unique.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("// Search for unique field\n$('.form-group[data-unique]').each(function() {\n  var group = $(this);\n  var search = group.data('unique');\n  var ignore = group.data('ignore');\n  var params = group.data('params') || {};\n  group.find('input[type=\"text\"]').on('change keyup', function() {\n    var input = $(this);\n    group.removeClass('has-feedback has-error has-success');\n    if (input.val() && input.val() != ignore) {\n      var vars = $.extend({}, params);\n      vars[input.prop('name')] = this['value'];\n      $.post(search, vars, function(result) {\n        if (input.val()) {\n          group\n            .addClass('has-feedback')\n            .addClass(!!result ? 'has-error' : 'has-success');\n        }\n      });\n    }\n  });\n});\n\n\n//# sourceURL=webpack:///./src/widgets/unique.js?");

/***/ })

/******/ });