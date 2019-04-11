import { browser, USERS_URL, sleep } from '../helpers';
import { expect } from 'chai';
import { until, By, WebElement } from 'selenium-webdriver';
const getButton = () => browser.findElement(By.css('a[href="/users/add"]'));
const getSelect = () => browser.findElement(By.tagName('select'));
export const viewTest = async (pass: boolean) => {
  await browser.get(USERS_URL);
  const addUser = await browser
    .findElement(By.css('a[href="/users/add"]'))
    .catch(err => err);
  const result = expect(addUser).to;

  pass
    ? result.be.instanceOf(WebElement)
    : result.not.be.instanceOf(WebElement);
};

export const addTest = async () => {
  await browser.get(USERS_URL);
  const button = await getButton();

  await button.click();

  const [name, username, email, password, confirm, submit] = await Promise.all([
    browser.findElement(By.css('[name="name"]')),
    browser.findElement(By.css('[name="username"]')),
    browser.findElement(By.css('[name="email"]')),
    browser.findElement(By.css('[name="password"]')),
    browser.findElement(By.css('[name="confirm"]')),
    browser.findElement(By.css('button[type="submit"]'))
  ]);

  await Promise.all([
    name.sendKeys('Foo'),
    username.sendKeys('fbar'),
    email.sendKeys('foo-bar@foobar.ca'),
    password.sendKeys('barfoo'),
    confirm.sendKeys('barfoo')
  ]);

  await submit.click();

  const message = await browser.wait(
    until.elementLocated(By.css('.alert.alert-success > span'))
  );

  expect(await message.getText()).to.contain('Foo');

  await browser.get(USERS_URL);

  const select = getSelect();

  expect(select).to.be.instanceOf(WebElement);

  return select;
};

export const editTest = async () => {
  await browser.get(USERS_URL);
  const select = await addTest();
  select.click();
  const target = 'option[value*="fbar"]';

  await browser.findElement(By.css(target)).click();

  await browser.findElement(By.css('[name="name"]')).sendKeys('Bar');

  await browser.findElement(By.css('button[type="submit"]')).click();

  await getSelect().click();

  const text = await browser.findElement(By.css(target)).getText();

  expect(text).to.equal('FooBar');
};
