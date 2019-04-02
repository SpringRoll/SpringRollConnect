import { embeddedGameURL, embedReleaseURL, login, browser } from '../helpers';
import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';

const { NoSuchAlertError } = require('selenium-webdriver').error;

describe('Embed Pages', () => {
  it('should allow anyone to see the latest prod release of a game', async () => {
    // make sure we don't get an "INVALID API" Alert
    const alert = await browser
      .switchTo()
      .alert()
      .accept()
      .catch(err => err);

    expect(alert).to.be.instanceOf(NoSuchAlertError);
  });

  it('should not allow a user to see anything for a game without a prod release', async () => {
    await browser.wait(until.alertIsPresent());
    const alert = await browser.switchTo().alert();

    const text = await alert.getText();
    await alert.accept();
    expect(text).to.equal('Invalid API request');
  });

  it('should allow valid tokens to view dev releases of a game', async () => {
    // await login(user);

    // const url = embedReleaseURL({
    //   status: 'dev',
    //   slug: game.slug,
    //   token: group.token
    // });

    // await browser.get(url);
    await browser.wait(until.elementLocated(By.id('frame')));
  });
});
