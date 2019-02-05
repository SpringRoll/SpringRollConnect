const webdriver = require('selenium-webdriver');
const { WebDriver } = webdriver;

const Options = require('selenium-webdriver/chrome').Options;

let _browser = undefined;

/**
 *
 *
 * @class Selenium
 */
export class Selenium {
  static async init() {
    _browser = await new webdriver.Builder()
      .forBrowser('chrome', '71.0.3578.98')
      .setChromeOptions(
        new Options().addArguments('--no-sandbox', '--headless')
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
    return _browser;
  }
}
