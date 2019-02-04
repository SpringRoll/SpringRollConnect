import {
  makeRelease,
  makeGame,
  Selenium,
  releaseURL,
  makeUserWithGroup,
  gameURL,
  logout,
  login
} from '../helpers';
import { expect } from 'chai';
import { beforeEach } from 'mocha';

const {
  UnexpectedAlertOpenError,
  NoSuchAlertError
} = require('selenium-webdriver').error;

describe('Embed Pages', () => {
  beforeEach(async () => {
    await logout();
  });

  it('should allow anyone to see the latest prod release of a game', async () => {
    const game = await makeGame();
    await makeRelease(game, 'prod');

    const url = gameURL(game);

    await Selenium.Browser.get(url).catch(err => err);

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
    const url = releaseURL(release);

    const err = await Selenium.Browser.get(url).catch(err => err);
    const alert = await Selenium.Browser.switchTo()
      .alert()
      .catch(err => err);

    console.log(err, alert);

    console.log(alert);

    const text = await alert.getText();
    expect(text).to.equal('Invalid API request');
  });

  it('should allow valid tokens to view dev releases of a game', async () => {
    const { group, user } = await makeUserWithGroup({}, { privilege: 2 });

    const game = await makeGame({
      groups: [{ permission: 2, group: group._id }]
    });

    const release = await makeRelease(game, 'dev');
    const url = releaseURL(release, group.token);

    await login(user);
    await Selenium.Browser.get(url);

    const alert = await Selenium.Browser.switchTo()
      .alert()
      .catch(err => err);

    expect(alert).to.be.instanceOf(NoSuchAlertError);
  });
});
