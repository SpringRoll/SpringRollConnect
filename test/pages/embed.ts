import {
  login,
  browser,
  GAME_ONE_URL,
  GAME_TWO_EMBED_URL,
  sleep
} from '../helpers';
import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';

const { NoSuchAlertError } = require('selenium-webdriver').error;

describe('Embed Pages', () => {
  it('should allow anyone to see the latest prod release of a game', async () => {
    const alert = await browser
      .switchTo()
      .alert()
      .accept()
      .catch(err => err);

    expect(alert).to.be.instanceOf(NoSuchAlertError);
  });

  it('should not allow a user to see anything for a game without a prod release', async () => {
    await browser.get(GAME_TWO_EMBED_URL);
    await browser.wait(until.alertIsPresent());
    const alert = await browser.switchTo().alert();

    const text = await alert.getText();
    await alert.accept();
    expect(text).to.equal('No Release Available');
  });

  it('should allow valid tokens to view dev releases of a game', async () => {
    await login('reader');
    await browser.get(GAME_ONE_URL);

    await browser
      .findElement(
        By.css('div:nth-child(4) > div.col-sm-10 > div > div > a:nth-child(1)')
      )
      .click();
    ``;

    await browser.wait(until.elementLocated(By.id('frame')));
  });
});
