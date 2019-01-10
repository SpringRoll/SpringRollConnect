const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');

const selenium = {
  /**
   * Initializes the underlying selenium browser implementation so that it can be used in a test
   * @return WebDriver The web driver that was instantiated
   * @see selenium.browser
   */
  init: () => {
    selenium.browser = new webdriver.Builder()
      .forBrowser('chrome')
      .build();

    return selenium.browser;
  },

  /**
   * The selenium web driver instance that is created by the init method
   * @type WebDriver
   * @see {@link https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebDriver.html}
   */
  browser: null,

  /**
   * A reference to the selenium By object, for querying DOM elements on the page
   * @type By
   * @see {@link https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_By.html}
   */
  By: webdriver.By
}

module.exports = selenium;
