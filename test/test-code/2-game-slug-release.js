import {
  gameReleasesURL,
  browser,
  createUserGroupGameRelease,
  login,
  sleep,
  Release
} from '../helpers';
import { expect } from 'chai';
import { until, By, error, WebElement } from 'selenium-webdriver';
import { release } from 'os';
/**
 *
 * @param {0 | 1 | 2} permission
 * @param {0 | 1 | 2} privilege
 * @param {"dev" | "qa" | "stage" | "prod"} gameStatus
 */
export const basic = async (permission, privilege, gameStatus) => {
  const { user, game } = await createUserGroupGameRelease({
    permission,
    privilege,
    gameStatus
  });
  const url = gameReleasesURL(game);
  await login(user);

  await browser.get(url);

  const err = await browser
    .wait(until.elementsLocated(By.css('[data-target="#addRelease"]')), 500)
    .catch(err => err);

  expect(err).to.not.be.instanceOf(error.TimeoutError);

  const text = await browser.findElement(By.className('panel-title')).getText();

  expect(text).to.equal('Releases');
  return game;
};

export const publicUserTest = async () => {
  const { game } = await createUserGroupGameRelease();
  const url = gameReleasesURL(game);
  await browser.get(url);

  await browser.wait(until.elementLocated(By.className('form-login')), 1000);
};

/**
 *
 * @param {boolean} pass
 */
export const changeTest = async pass => {
  const formButton = await browser.findElement(
    By.className(`btn btn-default btn-block status dropdown-toggle`)
  );

  expect(await formButton.isEnabled()).to.equal(pass);

  if (pass) {
    const oldText = await formButton.getText();

    await formButton.click();

    const radio = await browser.findElement(
      By.css(
        '.dropdown-menu.statusChange-menu > li:not(.active) > a > input[type="radio"]'
      )
    );

    await radio.click();

    const newText = await browser
      .findElement(
        By.className(`btn btn-default btn-block status dropdown-toggle`)
      )
      .then(async ele => await ele.getText());

    if (pass) {
      expect(newText).to.not.equal(oldText);
    } else {
      expect(newText).to.equal(oldText);
    }
  }
};

export const downloadTest = async () => {
  await browser.findElement(By.className('help-block updated')).click();

  await browser
    .findElement(
      By.css(
        'body > div > div > div.col-sm-9 > div > div.panel-body.releases > div:nth-child(1) > div > div.col-sm-9 > div > div > form:nth-child(2) > div > button'
      )
    )
    .click();

  await browser
    .findElement(
      By.css(
        'body > div > div > div.col-sm-9 > div > div.panel-body.releases > div:nth-child(1) > div > div.col-sm-9 > div > div > form:nth-child(2) > div > ul > li > a[href*="release"]'
      )
    )
    .click();

  await browser.wait(until.titleContains('Page not found'), 1000);
};

/**
 * TODO: Implement logic for when a user is not expected to be able to edit
 * @param {boolean} pass
 */
export const editTest = async pass => {
  await browser.findElement(By.className('help-block updated')).click();

  await browser
    .findElement(
      By.css(
        'body > div > div > div.col-sm-9 > div > div.panel-body.releases > div:nth-child(1) > div > div.col-sm-9 > div > div > form:nth-child(2) > div > button'
      )
    )
    .click();

  await browser
    .findElement(
      By.css(
        'body > div > div > div.col-sm-9 > div > div.panel-body.releases > div:nth-child(1) > div > div.col-sm-9 > div > div > form:nth-child(2) > div > ul > li> a > span.glyphicon-pencil'
      )
    )
    .click();

  await browser
    .wait(until.elementLocated(By.id('version')), 500)
    .sendKeys('1.1.0');
  await browser
    .findElement(By.css(`button[name="action"][value="PATCH"]`))
    .click();

  const text = await browser
    .wait(
      until.elementLocated(
        By.css(
          `body > div > div > div.col-sm-9 > div > div.panel-body.releases > div:nth-child(1) > div > div.col-sm-9 > div > div > h4 > strong`
        )
      )
    )
    .getText();

  expect(text).to.contain('Version 1.1.0');
};

/**
 *
 * @param {boolean} pass
 */
export const addReleaseTest = async pass => {
  const hash = '673151e71637a5e5cd2dc6c6fdb63a8446df2232';
  const releaseCount = await Release.find().count();
  const target = await browser
    .wait(until.elementLocated(By.css('[data-target="#addRelease"]')), 50)
    .catch(err => err);

  if (!pass) {
    expect(target).to.not.be.instanceOf(WebElement);
    return;
  }
  expect(target).to.be.instanceOf(WebElement);

  await target.click();

  const input = await browser.findElement(By.id('commitId'));
  await browser.wait(until.elementIsVisible(input), 1000);

  await input.sendKeys(hash);
  await browser.findElement(By.id('version')).sendKeys('1.0.0');
  await browser
    .findElement(
      By.css(
        '#addRelease > div > form > div.modal-footer > button.btn.btn-primary'
      )
    )
    .click();

  const count = await delay(releaseCount);

  expect(count).to.equal(releaseCount + 1);
};

export const deleteReleaseTest = async pass => {
  const releaseCount = await Release.find().count();
  await browser.findElement(By.className('help-block updated')).click();
  await browser
    .findElement(
      By.css(
        'body > div > div > div.col-sm-9 > div > div.panel-body.releases > div:nth-child(1) > div > div.col-sm-9 > div > div > form:nth-child(2) > div > button'
      )
    )
    .click();

  const target = await browser.findElement(
    By.css(
      'body > div > div > div.col-sm-9 > div > div.panel-body.releases > div:nth-child(1) > div > div.col-sm-9 > div > div > form > button > span.glyphicon-trash'
    )
  );

  if (!pass) {
    expect(target).to.not.be.instanceOf(WebElement);
    return;
  }

  expect(target).to.be.instanceOf(WebElement);

  await target.click();
  await browser
    .switchTo()
    .alert()
    .accept();

  const count = await delay(releaseCount);

  expect(count).to.equal(releaseCount - 1);
};

/**
 * Because waiting for the page to update was proving to be unreliable
 * @param {number} releaseCount
 */
const delay = async releaseCount => {
  let count;
  let attempts = 5;
  while (true) {
    count = await Release.find().count();
    if (releaseCount !== count || 0 >= --attempts) {
      break;
    }

    await sleep(50);
  }

  return count;
};
