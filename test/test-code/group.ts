import {
  login,
  browser,
  GROUPS_URL,
  isLoginPage,
  isLandingPage
} from '../helpers';
import { expect } from 'chai';
import { until, By, WebElement } from 'selenium-webdriver';

export const publicTest = async () => {
  await browser.get(GROUPS_URL);
  await isLoginPage();
};

export const view = async (pass: boolean) => {
  await browser.get(GROUPS_URL);

  if (!pass) {
    expect(await isLandingPage()).to.be.true;
    return;
  }

  const text = await browser
    .wait(until.elementLocated(By.className('panel-title')))
    .getText();

  expect(text).to.equal('Groups');
};

export const addGroup = async () => {
  await browser.get(GROUPS_URL);
  await browser.findElement(By.css('a[href="/groups/add"]')).click();

  const [name, slug, submit] = await Promise.all([
    browser.findElement(By.id('name')),
    browser.findElement(By.id('slug')),
    browser.findElement(By.css('button[type="submit"]'))
  ]);

  await name.sendKeys('FooBar');
  await slug.sendKeys('foo-bar');

  await submit.click();

  await browser.get(GROUPS_URL);

  const element = await browser
    .wait(
      until.elementLocated(By.css('a[href="/groups/group/foobarfoo-bar"]')),
      250
    )
    .catch(err => err);

  expect(element).to.be.instanceOf(WebElement);
};
