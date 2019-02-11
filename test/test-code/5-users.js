import { makeUserWithGroup, login, browser, USERS_URL } from '../helpers';
import { expect } from 'chai';
import { until, By, WebElement } from 'selenium-webdriver';
/**
 *
 * @param {0 | 1 | 2} [privilege]
 */
export const basic = async privilege => {
  if ('undefined' === typeof privilege) {
    await browser.get(USERS_URL);
    await browser.wait(until.elementLocated(By.className('form-login')), 250);
    return;
  }

  const { user } = await makeUserWithGroup({ privilege });

  await login(user);

  await browser.get(USERS_URL);

  if (2 > privilege) {
    const banner = await browser.wait(
      until.elementLocated(By.css('div.col-sm-9 > h3')),
      250
    );
    expect(await banner.getText()).to.equal('Games');
    return;
  }

  await viewTest();
};

export const viewTest = async () => {
  const addUser = await browser.findElement(By.css('a[href="/users/add"]'));

  expect(addUser).to.be.instanceOf(WebElement);

  return addUser;
};

export const addTest = async () => {
  const button = await viewTest();

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

  const select = await browser.findElement(By.tagName('select'));

  expect(select).to.be.instanceOf(WebElement);

  return select;
};

export const editTest = async () => {
  const select = await addTest();
  select.click();

  const option = await browser.findElement(By.css('option:nth-child(2)'));
  await option.click();

  const name = browser.findElement(By.css('[name="name"]'));

  await name.sendKeys('Bar');

  const submit = await browser.findElement(By.css('button[type="submit"]'));

  await submit.click();

  await browser.get(USERS_URL);

  const newName = await browser.findElement(By.css('option:nth-child(2)'));

  expect(await newName.getText()).to.equal('BarFoo');
};
