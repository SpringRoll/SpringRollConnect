import {
  makeUserWithGroup,
  makeGroup,
  login,
  browser,
  groupURL,
  sleep,
  isLoginPage,
  makeUser,
  makeGame
} from '../helpers';
import { until, By, WebElement, error } from 'selenium-webdriver';
import { expect } from 'chai';

const { NoSuchElementError } = error;

export const basic = async privilege => {
  const group = await makeGroup({
    name: 'FooBar',
    isUserGroup: false,
    privilege: 0,
    slug: 'foo-bar',
    token: 'c7d2a4d0af1b0a6390f83420aaf8bbd5fa068f75'
  });

  const groupTwo = await makeGroup({
    name: 'BarFoo',
    isUserGroup: false,
    privilege: 0,
    slug: 'bar-foo',
    token: '317b9a82236565332bb1f51f022d2e188d31466b'
  });
  const { user } = await makeUserWithGroup({ privilege, groups: [group._id] });
  await makeUser({
    username: 'fBar',
    name: 'Foo Bar',
    email: 'foobar@barfoo.ca',
    password: 'foobar'
  });

  await makeGame({
    groups: 2 > privilege ? [{ permission: privilege, group: group._id }] : []
  });

  return {
    user,
    group,
    groupTwo
  };
};

export const before = async privilege => {
  const { user, group, groupTwo } = await basic(privilege);
  await login(user);
  const url = groupURL(group);
  const urlTwo = groupURL(groupTwo);

  return { user, group, groupTwo, url, urlTwo };
};

export const publicTest = async () => {
  const { group } = await basic();
  await browser.get(groupURL(group));
  await isLoginPage();
};

export const viewGroup = async ({ inGroup = false, privilege = 0 }) => {
  const { url, urlTwo } = await before(privilege);

  await browser.get(inGroup ? url : urlTwo);

  const css =
    inGroup || 2 === privilege
      ? 'form[action*="/groups/group/"]'
      : 'div.alert.alert-warning';

  const found = await browser
    .wait(until.elementLocated(By.css(css)), 250)
    .catch(err => err);

  // if (2 === privilege) {
  //   await sleep(9999999);
  // }
  expect(found).to.be.instanceOf(WebElement);
};

export const addUser = async config => {
  await viewGroup(config);

  if (2 > config.privilege) {
    const err = await browser
      .findElement(By.css('button[data-target="#addUser"]'))
      .catch(err => err);

    expect(err).to.be.instanceOf(NoSuchElementError);
    return;
  }

  await browser.findElement(By.css('button[data-target="#addUser"]')).click();

  // console.log('did run');

  const userSearch = await browser.findElement(By.css('#userSearch'));
  await browser.wait(until.elementIsVisible(userSearch));

  await userSearch.sendKeys('Foo Bar');
  // Pause here as the dom is rapidly changing and can cause a selenium error
  await sleep(100);
  await browser
    .wait(until.elementLocated(By.css('#userSearchDisplay > ul > li > button')))
    .click();

  const button = await browser.findElement(
    By.css('div.modal-footer > button[value="addUsers"]')
  );

  await button.click();

  browser.wait(until.stalenessOf(button));

  const list = await browser.findElements(
    By.css('div.col-md-4.col-sm-5 > ul > li')
  );

  expect(list).to.be.length(1);
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

  expect(list).to.be.length(0);
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

  await gameSearch.sendKeys('Test');

  await sleep(100);
  await browser
    .wait(until.elementLocated(By.css('#gameSearchDisplay > ul > li > button')))
    .click();

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

  expect(newToken).to.not.equal(oldToken);
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

  await input.sendKeys('Foo');
  await browser.findElement(By.css('button[value="updateGroup"]')).click();

  await browser.wait(until.stalenessOf(input));

  const title = await browser.findElement(By.tagName('h2')).getText();

  expect(title).to.equal('BarFooFoo');
};
