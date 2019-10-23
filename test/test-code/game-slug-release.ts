import {
  browser,
  isLoginPage,
  makeRandomString,
  GAME_ONE_RELEASES_URL,
  sleep
} from '../helpers';
import { expect } from 'chai';
import { until, By, error, WebElement } from 'selenium-webdriver';

/**
 * Initializes the test environment by
 * - Creating a user group game and associated release
 * - Logs the user in
 * - Goes to look at the releases page
 * @param {0 | 1 | 2} permission
 * @param {0 | 1 | 2} privilege
 * @param {"dev" | "qa" | "stage" | "prod"} gameStatus
 */
export const init = async () => {
  await browser.get(GAME_ONE_RELEASES_URL);
  const err = await browser
    .wait(until.elementsLocated(By.css('a[href*="releases"].active')), 500)
    .catch(err => err);

  expect(err).to.not.be.instanceOf(error.TimeoutError);

  const text = await browser.findElement(By.className('panel-title')).getText();

  expect(text).to.equal('Releases');
};

export const publicUserTest = async () => {
  await browser.get(GAME_ONE_RELEASES_URL);

  await isLoginPage();
};

export const viewTest = async () => {
  await init();

  const pageOneElements = await browser.findElements(By.css('.release'));

  expect(pageOneElements.length).to.equal(10);

  await browser.findElement(By.css('a[href*="page/2"]')).click();
  const pageTwoElements = await browser.findElements(By.css('.release'));

  expect(pageTwoElements.length).to.equal(2);
};

/**
 *
 * @param {boolean} pass
 */
export const changeTest = async pass => {
  await init();
  const formButton = await browser
    .findElement(
      By.className(`btn btn-default btn-block status dropdown-toggle`)
    )
    .catch(err => err);

  if (pass) {
    expect(await formButton.isEnabled()).to.equal(pass);
  } else {
    expect(formButton).to.be.instanceOf(error.NoSuchElementError);
    return;
  }

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
  await init();
  await browser.findElement(By.css('.help-block.updated')).click();

  await browser
    .findElement(By.css('button.dropdown-toggle > .glyphicon.glyphicon-cog'))
    .click();

  await browser.findElement(By.css('a[href*="release.zip"]')).click();
};

/**
 * @param {boolean} pass
 */
export const editTest = async pass => {
  await init();
  await browser.findElement(By.className('help-block updated')).click();

  await browser
    .findElement(By.css('button.dropdown-toggle > .glyphicon.glyphicon-cog'))
    .click();

  const button = await browser
    .findElement(By.css('span.glyphicon-pencil'))
    .catch(err => err);

  if (pass) {
    await button.click();
  } else {
    expect(button).to.be.instanceOf(error.NoSuchElementError);
    return;
  }

  await browser
    .wait(until.elementLocated(By.id('version')), 500)
    .sendKeys('1.1.0'); //seems to be not working??
  await browser
    .findElement(By.css(`button[name="action"][value="PATCH"]`))
    .click();

  const text = await browser
    .wait(until.elementLocated(By.css('h4 > strong')))
    .getText();

  expect(text).to.contain('Version 1.1.0');
};

/**
 *
 * @param {boolean} pass
 */
export const addReleaseTest = async pass => {
  await init();
  const badgeCounter = await getBadgeCount();
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

  await input.sendKeys(makeRandomString());
  await browser.findElement(By.id('version')).sendKeys('1.0.0');
  await browser
    .findElement(
      By.css(
        '#addRelease > div > form > div.modal-footer > button.btn.btn-primary'
      )
    )
    .click();
  expect(await getBadgeCount()).to.equal(badgeCounter + 1);
};

export const deleteReleaseTest = async pass => {
  await init();
  const badgeCounter = await getBadgeCount();

  await browser.findElement(By.className('help-block updated')).click();
  await browser.findElement(
    By.css('button.dropdown-toggle > .glyphicon.glyphicon-cog')
  );

  const target = await browser
    .findElement(By.css('button > span.glyphicon-trash'))
    .catch(err => err);
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
  expect(await getBadgeCount()).to.equal(badgeCounter - 1);
};

async function getBadgeCount() {
  return Number(
    await browser.wait(until.elementLocated(By.css('.badge'))).getText()
  );
}
