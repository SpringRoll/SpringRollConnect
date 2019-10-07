const webdriver = require('selenium-webdriver');
const { WebDriver } = webdriver;

const Options = require('selenium-webdriver/chrome').Options;

/**
 * @type {WebDriver}
 */
export let browser = undefined;

/**
 *
 *
 * @class Selenium
 */
export class Selenium {
  static async init() {
    browser = await new webdriver.Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        new Options().addArguments(
          '--no-sandbox',
          //'--headless',
          //Some Elements are hidden at smaller browser sizes
          'window-size=1240,720'
        )
      )
      .build();
    return;
  }

  /**
   *
   *
   * @readonly
   * @static
   * @memberof Selenium
   * @returns {WebDriver}
   */
  static get Browser() {
    return browser;
  }
}
