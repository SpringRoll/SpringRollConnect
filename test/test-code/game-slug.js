import {
  browser,
  createUserGroupGameRelease,
  login,
  gameURL,
  isLoginPage,
  sleep
} from '../helpers';
import { expect } from 'chai';
import { until, By, error, Key, WebElement } from 'selenium-webdriver';

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

export const editGameTest = async pass => {
  const test = 'Test description';

  const button = await browser
    .wait(until.elementLocated(By.css('button[data-target="#editGame"]')), 500)
    .catch(err => err);

  if (pass) {
    await button.click();
  } else {
    expect(button).to.not.be.instanceOf(WebElement);
    return;
  }

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
export const privilegeTest = async pass => {
  const link = await browser
    .findElement(By.css('a[href*="/privileges"]'))
    .catch(err => err);
  if (pass) {
    await link.click();
    await modifyGroup();
    await deleteGroup();
    await addGroup();
  } else {
    expect(link).to.be.instanceOf(error.NoSuchElementError);
  }
};

async function deleteGroup() {
  await browser.findElement(By.css(`button[value="removeGroup"]`)).click();

  await browser
    .switchTo()
    .alert()
    .accept();

  const element = await browser
    .wait(until.elementLocated(By.css('.alert.alert-warning')), 500)
    .catch(err => err);

  expect(element).to.be.instanceOf(WebElement);
}

async function addGroup() {
  await browser.findElement(By.css(`button[data-target="#addGroup"]`)).click();

  const search = await browser.findElement(By.id('groupSearch'));

  await browser.wait(until.elementIsVisible(search));

  await search.sendKeys('F');
  await sleep(100);
  const searchItem = await browser.findElement(By.css(`button.search-item`));

  await browser.wait(until.elementIsVisible(searchItem));

  await searchItem.click();

  await browser
    .findElement(By.css(`button[value="addGroup"`))
    .sendKeys(Key.ENTER);

  const newGroup = await browser
    .wait(until.elementLocated(By.css('a[href*="foo-bar"]')), 500)
    .catch(err => err);

  expect(newGroup).to.be.instanceOf(WebElement);
}

async function modifyGroup() {
  let radioButtons = await browser.wait(
    until.elementsLocated(
      By.css('form > input[type="radio"][name="permission"]')
    ),
    500
  );

  const selectedArray = await Promise.all(
    radioButtons.map(r => r.isSelected())
  );

  const index = selectedArray.findIndex(value => !value);

  await radioButtons[index].click();

  radioButtons = await browser.wait(
    until.elementsLocated(
      By.css('form > input[type="radio"][name="permission"]')
    ),
    500
  );

  expect(await radioButtons[index].isSelected()).to.be.true;
}
