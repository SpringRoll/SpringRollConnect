import {
  embeddedGameURL,
  embedReleaseURL,
  login,
  logout,
  makeGame,
  makeRelease,
  makeUserWithGroup,
  Selenium,
  sleep
} from '../helpers';
import { expect } from 'chai';

const { NoSuchAlertError } = require('selenium-webdriver').error;

describe('Embed Pages', () => {
  it('should allow anyone to see the latest prod release of a game', async () => {
    await logout();
    const game = await makeGame();
    await makeRelease(game, 'prod');

    const url = embeddedGameURL(game);

    await Selenium.Browser.get(url);

    // make sure we don't get an "INVALID API" Alert
    const alert = await Selenium.Browser.switchTo()
      .alert()
      .accept()
      .catch(err => err);

    expect(alert).to.be.instanceOf(NoSuchAlertError);
  });

  it('should not allow a user to see anything for a game without a prod release', async () => {
    const game = await makeGame();
    const release = await makeRelease(game, 'dev');
    const url = embedReleaseURL(release);

    await Selenium.Browser.get(url).catch(err => err);
    const alert = await Selenium.Browser.switchTo()
      .alert()
      .catch(err => err);

    const text = await alert.getText();
    await alert.accept();
    expect(text).to.equal('Invalid API request');
  });

  it('should allow valid tokens to view dev releases of a game', async () => {
    const [{ group, user }] = await Promise.all([
      makeUserWithGroup(),
      logout()
    ]);

    const game = await makeGame({
      groups: [{ permission: 0, group: group._id }]
    });

    const [release] = await Promise.all([
      makeRelease(game, 'dev'),
      login(user)
    ]);

    const url = embedReleaseURL(release, group.token);

    await Selenium.Browser.get(url);
    await sleep(20); // TODO: Figure out why a 20 millisecond delay allows the test to pass
  });
});
