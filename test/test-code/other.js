import {
  browser,
  isLoginPage,
  DOCS_URL,
  login,
  PROFILE_URL,
  PASSWORD_URL,
  MAIN_URL,
  sleep
} from '../helpers';
import { By, until, WebElement } from 'selenium-webdriver';
import { expect } from 'chai';
export const publicTest = async url => {
  await browser.get(url);
  await isLoginPage();
};

/**
 * Initializes the test environment by
 * - Creating a user group game and associated release
 * - Logging the user in
 */
export const init = async () => {
  // await login(user);
};

export const docTest = async () => {
  await browser.get(DOCS_URL);
  const text = await browser.findElement(By.className('well')).getText();

  expect(text).to.contain('GET /api/games');
};

export const profileTest = async () => {
  await browser.get(PROFILE_URL);
  const name = await browser.findElement(By.id('name')).getAttribute('value');

  expect(name).to.contain('Spring Roll');
};

export const passwordTest = async () => {
  await browser.get(PASSWORD_URL);

  expect(await browser.findElement(By.id('oldPassword'))).to.exist;
};

export const groupsTest = async () => {
  await browser.get(MAIN_URL);
  const text = await browser
    .findElement(By.css('a[href="/groups/group/foo-bar"]'))
    .getText();

  expect(text).to.equal('FooBar');
};

export const gamesTest = async () => {
  await browser.get(MAIN_URL);
  const text = await browser
    .findElement(By.css('a[href="/games/test-game"]'))
    .getText();

  expect(text).to.contain('Test Game');
};

export const searchTest = async () => {
  await browser.get(MAIN_URL);

  await browser.findElement(By.id('allGameSearch')).sendKeys('Test');
  await sleep(100);
  const item = await browser.wait(
    until.elementLocated(By.className('search-item'))
  );

  browser.wait(until.elementIsVisible(item));

  item.click();

  const element = await browser
    .wait(
      until.elementLocated(By.css('a[href="/games/test-game/releases"]')),
      250
    )
    .catch(err => err);

  expect(element).to.be.instanceOf(WebElement);
};
