import {
  browser,
  isLoginPage,
  DOCS_URL,
  PROFILE_URL,
  PASSWORD_URL,
  MAIN_URL,
  sleep,
  GAME_ONE_SLUG,
  GAME_ONE_NAME,
  READERS_GROUP_SLUG,
  READERS_GROUP_NAME
} from '../helpers';
import { By, until, WebElement } from 'selenium-webdriver';
import { expect } from 'chai';
export const publicTest = async url => {
  await browser.get(url);
  await isLoginPage();
};

export const docTest = async () => {
  await browser.get(DOCS_URL);
  const text = await browser.findElement(By.className('well')).getText();

  expect(text).to.contain('GET /api/games');
};

export const profileTest = async () => {
  await browser.get(PROFILE_URL);
  const name = await browser.findElement(By.css('.panel-title')).getText();

  expect(name).to.equal('Edit Your Profile');
};

export const passwordTest = async () => {
  await browser.get(PASSWORD_URL);

  expect(await browser.findElement(By.id('oldPassword'))).to.exist;
};

export const groupsTest = async () => {
  await browser.get(MAIN_URL);
  const text = await browser
    .findElement(By.css(`a[href="/groups/group/${READERS_GROUP_SLUG}"]`))
    .getText();

  expect(text).to.equal(READERS_GROUP_NAME);
};

export const gamesTest = async () => {
  await browser.get(MAIN_URL);
  const text = await browser
    .findElement(By.css(`a[href="/games/${GAME_ONE_SLUG}"]`))
    .getText();

  expect(text).to.contain(GAME_ONE_NAME);
};

export const searchTest = async () => {
  await browser.get(MAIN_URL);

  await browser.findElement(By.id('allGameSearch')).sendKeys(GAME_ONE_NAME);
  await sleep(100);
  const item = await browser.wait(
    until.elementLocated(By.className('search-item'))
  );

  browser.wait(until.elementIsVisible(item));

  item.click();
  const element = await browser
    .wait(until.elementLocated(By.css(`a[href*="/releases"]`)), 1000)
    .catch(err => err);
  expect(element).to.be.instanceOf(WebElement);
};
