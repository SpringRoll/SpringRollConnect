import { browser } from './selenium';
import { By, WebElement, until } from 'selenium-webdriver';
import { expect } from 'chai';

/**
 * Forces the test to pause for a set amount of milliseconds
 * @param {number} ms
 */
export const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

export const isLoginPage = async () => {
  const form = await browser
    .wait(until.elementLocated(By.css('.form-login')), 250)
    .catch(err => err);
  expect(form).to.be.instanceof(WebElement);
  return form;
};

export const isLandingPage = async () => {
  const node = await browser
    .wait(until.elementLocated(By.css('div > h2')), 250)
    .catch(err => err);

  if (!(node instanceof WebElement)) {
    return false;
  }

  const text = await node.getText();

  return text.toLowerCase().includes('welcome');
};

export const makeRandomString = (length = 40) => {
  let random = '';
  for (let i = 0; i < length; i++) {
    random += (Math.random() * 10).toString().substring(0, 1);
  }
  return random;
};
