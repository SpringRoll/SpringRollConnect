const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');

const selenium = {
  init: () => {
    selenium.browser = new webdriver.Builder()
      .forBrowser('chrome')
      .build();

    return selenium.browser;
  }
}

module.exports = selenium;
