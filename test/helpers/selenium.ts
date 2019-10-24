import { Builder } from 'selenium-webdriver';

const Options = require('selenium-webdriver/chrome').Options;

export const browser = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(
    new Options().addArguments(
      '--no-sandbox',
      '--headless',
      //Some Elements are hidden at smaller browser sizes
      'window-size=1240,720'
    )
  )
  .build();
