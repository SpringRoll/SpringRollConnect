/**
 * Pagination object
 * @class Pagination
 * @constructor
 * @param {number} numItems Number of items
 * @param {number} currentPage The page currently being shown
 *   How many page button to display from left-to-right.
 *   Odd numbers wil produce nicer looking, even sided, UI.
 */
export const pagination = (numItems, currentPage) => {
  const current = parseInt(currentPage) || 1;
  const itemsPerPage = 24;
  const total = Math.ceil(numItems / itemsPerPage);
  const buttonCount = 7 < total ? 7 : total;
  const middleCount = Math.floor(buttonCount / 2);
  let min = current - middleCount;
  let max = current + middleCount;

  if (min < 1) {
    min = 1;
    max = buttonCount;
  }

  if (max > total) {
    max = total;
    min = total - buttonCount + 1;
  }

  const pages = [];
  while (min <= max) {
    pages.push(min);
    min++;
  }

  return {
    current: current,
    itemsPerPage,
    next: Math.min(total, current + 1),
    pages: pages,
    previous: Math.max(1, current - 1),
    size: buttonCount,
    start: (current - 1) * itemsPerPage,
    total: total
  };
};
