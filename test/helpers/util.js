import { makeGame } from './game';
import { makeUserWithGroup } from './user';
import { makeRelease } from './release';
import { Selenium } from './selenium';
import { By, WebElement } from 'selenium-webdriver';
/**
 * Forces the test to pause for a set amount of milliseconds
 * @param {number} ms
 */
export const sleep = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

/**
 * TODO: Think of a better name
 * Creates a User, Group, Game, and Release
 * @param {object} param
 * @param {"dev" | "qa" | "stage" | "prod"} [param.gameStatus="prod"]
 * @param {0 | 1 | 2} [param.permission=0]
 */
export const createUserGroupGameRelease = async ({
  gameStatus = 'prod',
  permission = 0
} = {}) => {
  const { group, user } = await makeUserWithGroup();

  const game = await makeGame({
    groups: [{ permission, group: group._id }]
  });
  const release = await makeRelease(game, gameStatus);
  return { group, user, game, release };
};

export const isLoginPage = async () => {
  const form = await Selenium.Browser.findElement(By.className('form-login'));
  return form instanceof WebElement;
};
