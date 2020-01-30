import {
  browser,
  sleep,
  isLoginPage,
  GROUPS_URL,
  READERS_GROUP_URL,
  EMPTY_GROUP_URL
} from '../helpers';
import { until, By, WebElement, error } from 'selenium-webdriver';
import { expect } from 'chai';

const { NoSuchElementError } = error;

export const publicTest = async () => {
  await browser.get(GROUPS_URL);
  await isLoginPage();
};

export const viewGroup = async ({ inGroup = false, privilege = 0 }) => {
  await browser.get(inGroup ? READERS_GROUP_URL : EMPTY_GROUP_URL);

  const css =
    inGroup || 2 === privilege
      ? 'form[action*="/groups/group/"]'
      : 'div.alert.alert-warning';

  const found = await browser
    .wait(until.elementLocated(By.css(css)), 250)
    .catch(err => err);

  expect(found).to.be.instanceOf(WebElement);
};

const getUserList = () =>
  browser.findElements(By.css('div.col-md-4.col-sm-5 > ul > li'));

export const addUser = async config => {
  await viewGroup(config);
  const count = (await getUserList()).length;

  if (2 > config.privilege) {
    const err = await browser
      .findElement(By.css('button[data-target="#addUser"]'))
      .catch(err => err);

    expect(err).to.be.instanceOf(NoSuchElementError);
    return;
  }

  await browser.findElement(By.css('button[data-target="#addUser"]')).click();

  const userSearch = await browser.findElement(By.css('#userSearch'));
  await browser.wait(until.elementIsVisible(userSearch));

  await userSearch.sendKeys('reader');
  // Pause here as the dom is rapidly changing and can cause a selenium error
  await sleep(1000);
  await browser
    .wait(until.elementLocated(By.css('#userSearchDisplay > ul > li > button')))
    .click();

  const button = await browser.findElement(
    By.css('div.modal-footer > button[value="addUsers"]')
  );

  await button.click();

  browser.wait(until.stalenessOf(button));

  expect(await getUserList()).to.be.length(count + 1);
};

export const removeUser = async config => {
  if (2 > config.privilege) {
    await viewGroup(config);
    const err = await browser
      .findElement(By.css('li.list-group-item:nth-child(1) button'))
      .catch(err => err);

    expect(err).to.be.instanceOf(NoSuchElementError);
    return;
  }
  await addUser(config);
  const count = (await getUserList()).length;

  await browser
    .findElement(By.css('li.list-group-item:nth-child(1) button'))
    .click();

  await browser.wait(until.alertIsPresent());

  await browser
    .switchTo()
    .alert()
    .accept();

  const list = await browser.findElements(
    By.css('div.col-md-4.col-sm-5 > ul > li')
  );

  expect(await getUserList()).to.be.length(count - 1);
};

export const addGame = async config => {
  await viewGroup(config);

  if (2 > config.privilege) {
    const err = await browser
      .findElement(By.css('button[data-target="#addGame"]'))
      .catch(err => err);

    expect(err).to.be.instanceOf(NoSuchElementError);
    return;
  }

  await browser.findElement(By.css('button[data-target="#addGame"]')).click();
  const gameSearch = await browser.findElement(By.id('gameSearch'));

  await browser.wait(until.elementIsVisible(gameSearch));

  await gameSearch.sendKeys('empty game 2');

  await sleep(500);
  await browser
    .wait(until.elementLocated(By.css('#gameSearchDisplay > ul > li > button')))
    .click();

  await sleep(500);

  await browser.findElement(By.css('button[value="addGames"]')).click();

  await browser.wait(until.stalenessOf(gameSearch));

  const list = await browser.findElements(
    By.css('div.col-md-10.col-sm-8.col-xs-6 > a')
  );

  expect(list).to.be.length(1);
};

export const removeGame = async config => {
  if (2 > config.privilege) {
    await viewGroup(config);
    const err = await browser
      .findElement(By.css('div.col-md-1.text-right > form > button'))
      .catch(err => err);

    expect(err).to.be.instanceOf(NoSuchElementError);
    return;
  }

  await addGame(config);

  await sleep(500);

  await browser
    .findElement(By.css('div.col-md-1.text-right > form > button'))
    .click();

  await browser.wait(until.alertIsPresent());

  await browser
    .switchTo()
    .alert()
    .accept();

  const list = await browser.findElements(
    By.css('div.col-md-10.col-sm-8.col-xs-6 > a')
  );

  expect(list).to.be.length(0);
};

export const refreshToken = async config => {
  await viewGroup(config);

  if (2 > config.privilege) {
    const err = await browser
      .findElement(By.css('button[value="refreshToken"]'))
      .catch(err => err);

    expect(err).to.be.instanceOf(NoSuchElementError);
    return;
  }

  const oldToken = await browser
    .findElement(By.css('input[readonly]'))
    .getAttribute('value');

  await browser.findElement(By.css('button[value="refreshToken"]')).click();

  await browser.wait(until.alertIsPresent());

  await browser
    .switchTo()
    .alert()
    .accept();

  const newToken = await browser
    .findElement(By.css('input[readonly]'))
    .getAttribute('value');

  // confirm reasonable date set as expiry date post refresh
  const expiryMessageQuery = await browser
    .findElements(By.className('input-group-addon'));
  await Promise.all(expiryMessageQuery);
  const expiryMessage = await expiryMessageQuery[1].getText();

  expect(newToken).to.not.equal(oldToken);
  expect(expiryMessage).to.equal('Expires in a year');
};

export const edit = async config => {
  await viewGroup(config);

  if (2 > config.privilege) {
    const err = await browser
      .findElement(By.css('button[data-target="#editGroup"]'))
      .catch(err => err);

    expect(err).to.be.instanceOf(NoSuchElementError);
    return;
  }

  await browser.findElement(By.css('button[data-target="#editGroup"]')).click();

  const input = await browser.findElement(By.id('name'));
  await browser.wait(until.elementIsVisible(input));

  await input.sendKeys('2');
  await browser.findElement(By.css('button[value="updateGroup"]')).click();

  await browser.wait(until.stalenessOf(input));

  const title = await browser.findElement(By.tagName('h2')).getText();

  expect(title).to.equal('empty2');
};
