import { expect } from 'chai';
import { until, By } from 'selenium-webdriver';

import { browser, login, logout, createUserGroupGameRelease } from '../helpers';

describe('Login', () => {
  it('should be able to log a user in', async () => {
    await logout();
    const { user } = await createUserGroupGameRelease();
    // attempt to login from the home page

    await login(user);

    // now check that we're on the correct page by looking for a logout link
    await browser.wait(until.elementsLocated(By.css('a[href="/logout"]')));

    const links = await browser.findElements(By.css('a[href="/logout"]'));

    expect(links.length).to.equal(1);
  });
});
