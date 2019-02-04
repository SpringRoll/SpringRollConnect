/**
 * Forces the test to pause for a set amount of milliseconds
 * @param {number} ms
 */
export const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};
