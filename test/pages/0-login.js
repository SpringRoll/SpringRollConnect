import { expect } from 'chai';
import { until, By } from 'selenium-webdriver';

import {
  MAIN_URL,
  VERSION,
  browser,
  login,
  createUserGroupGameRelease
} from '../helpers';

describe('SpringRollConnect', () => {
  it('should have the correct title', () => {
    return browser
      .get(MAIN_URL)
      .then(() => browser.getTitle())
      .then(title =>
        expect(title).to.equal(`Login - SpringRoll Connect v${VERSION}`)
      );
  });
});

describe('Login', () => {
  it('should be able to log a user in', async () => {
    const { user } = await createUserGroupGameRelease();
    // attempt to login from the home page
    await login(user);

    // now check that we're on the correct page by looking for a logout link
    await browser.wait(until.elementsLocated(By.css('a[href="/logout"]')));

    const links = await browser.findElements(By.css('a[href="/logout"]'));

    expect(links.length).to.equal(1);
  });
});
