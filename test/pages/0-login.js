import { expect } from 'chai';
import { until, By } from 'selenium-webdriver';

import { Selenium, makeUser, login, logout } from '../helpers';

describe('Login', () => {
  it('should be able to log a user in', async () => {
    await logout();
    const user = await makeUser();
    // attempt to login from the home page

    await login(user);

    // now check that we're on the correct page by looking for a logout link
    await Selenium.Browser.wait(
      until.elementsLocated(By.css('a[href="/logout"]'))
    );

    const links = await Selenium.Browser.findElements(
      By.css('a[href="/logout"]')
    );

    expect(links.length).to.equal(1);
  });
});
