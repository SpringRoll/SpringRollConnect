import {
  login,
  browser,
  GROUPS_URL,
  isLoginPage,
  isLandingPage
} from '../helpers';
import { expect } from 'chai';
import { until, By, WebElement } from 'selenium-webdriver';

/**
 * Initializes the test environment by
 * - Creating a user with a group
 * - Logging them
 * - Going to the groups page
 * - If no permission is provided, this setup code will assume the user is anonymous and check that they cannot reach
 *   the groups page
 * - If the user doesn't have admin privileges check that they also cannot reach the groups page
 * @param {0 | 1 | 2} [privilege=0]
 */
export const init = async privilege => {
  if ('undefined' === typeof privilege) {
    await browser.get(GROUPS_URL);
    await isLoginPage();
    return;
  }

  // await login(user);
  await browser.get(GROUPS_URL);

  if (2 > privilege) {
    expect(await isLandingPage()).to.be.true;
    return;
  }

  const text = await browser
    .wait(until.elementLocated(By.className('panel-title')))
    .getText();

  expect(text).to.equal('Groups');
};

export const addGroup = async () => {
  await init(2);
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
