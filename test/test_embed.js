const database = require('./helpers/database.js');
const selenium = require('./helpers/selenium.js');
const expect = require('chai').expect;

const { UnexpectedAlertOpenError, NoSuchAlertError } = require('selenium-webdriver').error;

const makeUser = () => {
  return new Promise((resolve, reject) => {
    database.models.User.createUser(
      {
        name: 'Spring Roll',
        username: 'testuser',
        password: 'secret',
        email: 'email@springroll.io'
      },
      2,
      resolve
    );
  });
}

const makeGame = () => {
  const game = new database.models.Game({
    title: 'Test Game',
    slug: 'test-game',
    bundleId: 'test-game',
    repository: 'https://springroll.io',
    location: 'https://springroll.io',
  });

  return game.save();
};

const makeRelease = (game, status) => {
  const release = new database.models.Release({
    game: game,
    status: status,
    commitId: 'bf408de70afb8c5cd633ff2678c0d0e4d192326f',
  });

  return release.save();
};

describe('embed pages', () => {
  it('should allow anyone to see the latest prod release of a game', async function() {
    const game = await makeGame();
    const release = await makeRelease(game, 'prod');
    await selenium.browser.get('http://localhost:3000/embed/test-game');

    // make sure we don't get an "INVALID API" Alert
    try {
      await selenium.browser.switchTo().alert();
      throw new Error('There was an alert on the page');
    } catch(e) {
      expect(e).to.be.instanceOf(NoSuchAlertError);
    }
  });

  it('should not allow a user to see anything for a game without a prod release', async function() {
    const game = await makeGame();
    const release = await makeRelease(game, 'dev');
    
    await selenium.browser.get('http://localhost:3000/embed/test-game');

    // make sure we get a "INVALID API" Alert
    const alert = await selenium.browser.switchTo().alert();

    const text = await alert.getText();
    expect(text).to.equal('Invalid API request');

    alert.accept();
  });

  /*
  it('should allow valid tokens to view dev releases of a game', async function() {
    const user = await makeUser();
    console.log(user);
    const game = await makeGame();
    const release = await makeRelease(game, 'dev');
  });
 */

  it('should not allow invalid tokens to view dev releases of a game');
});
