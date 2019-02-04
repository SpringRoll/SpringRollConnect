import { Selenium } from './selenium';
import { LOGOUT_URL, ROOT_DOMAIN } from './urls';

export async function logout() {
  await Selenium.Browser.get(LOGOUT_URL);
}

export async function login({ username, password }) {
  // To make sure we are not already logged in, let's log out
  await logout();

  const err = await Selenium.Browser.get(ROOT_DOMAIN);

  // set the username field
  const [userInput, passwordInput] = await Promise.all([
    Selenium.Browser.findElement({
      name: 'username'
    }),
    Selenium.Browser.findElement({
      name: 'password'
    })
  ]);
  await Promise.all([
    userInput.sendKeys(username),
    passwordInput.sendKeys(password)
  ]).catch(err => console.error(err));

  const form = await Selenium.Browser.findElement({ tagName: 'form' });
  await form.submit();
}
