import {
  browser,
  createUserGroupGameRelease,
  login,
  gameURL,
  isLoginPage
} from '../helpers';
import { expect } from 'chai';
import { until, By, error, Key } from 'selenium-webdriver';

export const publicUserTest = async () => {
  const { game } = await createUserGroupGameRelease();
  const url = gameURL(game);
  await browser.get(url);

  await isLoginPage();
};
/**
 * Initializes the test environment by
 * - Creating a user, group, game, and release
 * - Logs the user in
 * - Goes to the page for the newly created game
 * @param {0 | 1 | 2} permission
 * @param {0 | 1 | 2} privilege
 * @param {"dev" | "qa" | "stage" | "prod"} gameStatus
 */
export const init = async (permission, privilege, gameStatus) => {
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
  await browser
    .wait(
      until.elementLocated(By.css(`a.list-group-item[href*="releases"]`)),
      500
    )
    .click();

  const releasesTitle = await browser
    .wait(
      until.elementLocated(By.css(`div.panel-heading > h3.panel-title`)),
      500
    )
    .catch(err => err);

  expect(await releasesTitle.getText()).to.equal('Releases');
};

export const editGameTest = async () => {
  const test = 'Test description';

  await browser
    .wait(until.elementLocated(By.css('button[data-target="#editGame"]')), 500)
    .click();

  const formInput = await browser.wait(
    until.elementLocated(By.id('description')),
    500
  );

  await browser.wait(until.elementIsVisible(formInput));
  await formInput.sendKeys(test);

  await browser
    .findElement(By.css('button[value="PATCH"]'))
    .sendKeys(Key.ENTER);

  const description = await browser
    .wait(
      until.elementLocated(By.css(`div:nth-child(4) > div.col-sm-10 > p`)),
      500
    )
    .getText();

  expect(description).to.equal(test);
};
export const privilegeTest = async () => {
  const err = await browser
    .wait(
      until.elementLocated(By.css(' a.list-group-item[href*="privileges"]')),
      500
    )
    .click()
    .catch(err => err);

  expect(err).to.not.be.instanceOf(error.IError);
};
