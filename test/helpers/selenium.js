const webdriver = require('selenium-webdriver');
const chromedriver = require('chromedriver');

const selenium = {
  init: () => {
    // bind the little helper function for improve DOM element queries
    selenium.By = webdriver.By;

    selenium.browser = new webdriver.Builder()
      .forBrowser('chrome')
      .build();

    return selenium.browser;
  }
}

module.exports = selenium;
