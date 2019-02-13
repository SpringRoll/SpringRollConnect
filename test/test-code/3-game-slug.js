import {
  browser,
  createUserGroupGameRelease,
  login,
  gameURL,
  isLoginPage
} from '../helpers';
import { expect } from 'chai';
import { until, By, error } from 'selenium-webdriver';

export const publicUserTest = async () => {
  const { game } = await createUserGroupGameRelease();
  const url = gameURL(game);
  await browser.get(url);

  await isLoginPage();
};

export const basic = async (permission, privilege, gameStatus) => {
  const { user, game } = await createUserGroupGameRelease({
    permission,
    privilege,
    gameStatus
  });
  const url = gameURL(game);
  await login(user);

  await browser.get(url);

  await viewTest();
  return game;
};

export const viewTest = async () => {
  const element = await browser
    .wait(
      until.elementLocated(By.css('div:nth-child(2) > div.panel-heading > h3')),
      500
    )
    .catch(err => err);
  expect(element).to.not.be.instanceOf(error.TimeoutError);

  expect(await element.getText()).to.equal('Properties');
};

export const viewReleasesTest = async () => {
  const element = await browser
    .wait(
      until.elementLocated(By.css(`a.list-group-item[href*="releases"]`)),
      500
    )
    .catch(err => err);
  expect(element).to.not.be.instanceOf(error.TimeoutError);

  await element.click();

  const releasesTitle = await browser
    .wait(
      until.elementLocated(By.css(`div.panel-heading > h3.panel-title`)),
      500
    )
    .catch(err => err);

  expect(await releasesTitle.getText()).to.equal('Releases');
};

export const editGameTest = async () => {
  const button = await browser.wait(
    until.elementLocated(By.css('button[data-target="#editGame"]')),
    500
  );

  await button.click();
  const formInput = await browser.wait(
    until.elementLocated(By.id('description')),
    500
  );

  expect(formInput).to.not.be.instanceOf(error.TimeoutError);
  await browser.wait(until.elementIsVisible(formInput));

  const test = 'Test description';
  await formInput.sendKeys(test);

  const edit = await browser.findElement(By.css('button[value="PATCH"]'));
  await edit.click();

  const description = await browser.findElement(
    By.css(`div:nth-child(4) > div.col-sm-10 > p`)
  );

  expect(await description.getText()).to.equal(test);
};
export const privilegeTest = async () => {
  const err = await browser
    .wait(
      until.elementLocated(By.css(' a.list-group-item[href*="privileges"]')),
      500
    )
    .click()
    .catch(err => err);

  expect(err).to.be.instanceOf(error.IError);
};
