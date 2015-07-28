/**
 * Pagination object
 * @class Pagination
 * @constructor
 * @param {string} base The base url
 * @param {int} numItems Number of items
 * @param {int} currentPage The page currently being shown
 * @param {int} [buttonCount=7]
 *   How many page button to display from left-to-right.
 *   Odd numbers wil produce nicer looking, even sided, UI.
 * @param {int} [itemsPerPage=20] Number of items per page
 */
module.exports = function(base, numItems, currentPage, buttonCount, itemsPerPage)
{
    itemsPerPage = itemsPerPage || 30;

    var total = Math.ceil(numItems / itemsPerPage);
    var current = parseInt(currentPage) || 1;
    if (current > total)
    {
        current = total;
    }

    buttonCount = buttonCount || 7; //default to seven

    // if the button count is MORE than the actual pages avaiable,
    // set the button count to the pages avaialble
    buttonCount = buttonCount < total ? buttonCount : total;
    var middleCount = Math.floor(buttonCount / 2);

    var min = current - middleCount;
    var max = current + middleCount;

    if (min < 1)
    {
        min = 1;
        max = buttonCount;
    }

    if (max > total)
    {
        max = total;
        min = total - buttonCount + 1;
    }

    // Create an array of page numbers to display
    // in the current page's pagination UI. 
    var pages = [];
    while (min <= max)
    {
        pages.push(min);
        min++;
    }

    /**
     * The starting index of item
     * @property {int} start
     */
    this.start = (current - 1) * itemsPerPage;

    /**
     * The number of items per page
     * @property {int} itemsPerPage
     */
    this.itemsPerPage = itemsPerPage;

    /**
     * The pagination result
     * @property {object} result
     * @property {int} result.current The current page number
     * @property {int} result.total The total number of pages
     * @property {array} result.pages The collection of current showing pages
     * @property {String} result.baseUrl
     */
    this.result = {
        next: Math.min(total, current + 1),
        previous: Math.max(1, current - 1),
        current: current,
        total: total, 
        pages: pages,
        base: base,
        size: buttonCount
    };
};