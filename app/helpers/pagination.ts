export const pagination = (
  numItems,
  currentPage,
  base = '',
  itemsPerPage = 24
) => {
  const current = parseInt(currentPage) || 1;
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
    base,
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
