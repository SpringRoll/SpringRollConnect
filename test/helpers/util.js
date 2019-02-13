import { makeGame } from './game';
import { makeUserWithGroup } from './user';
import { makeRelease } from './release';
import { browser } from './selenium';
import { By, WebElement, until } from 'selenium-webdriver';
import { expect } from 'chai';
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
 * @param {0 | 1 | 2} [param.privilege=0]
 */
export const createUserGroupGameRelease = async ({
  gameStatus = 'prod',
  permission = 0,
  privilege = 0
} = {}) => {
  const { group, user } = await makeUserWithGroup({ privilege });

  const game = await makeGame({
    groups: [{ permission, group: group._id }]
  });
  const release = await makeRelease(game, gameStatus);
  return { group, user, game, release };
};

export const isLoginPage = async () => {
  const form = await browser
    .wait(until.elementLocated(By.css('.form-login')), 250)
    .catch(err => err);
  expect(form).to.be.instanceof(WebElement);
  return form;
};

export const isLandingPage = async () => {
  const node = await browser
    .wait(until.elementLocated(By.css('div > h2')), 250)
    .catch(err => err);

  if (!(node instanceof WebElement)) {
    return false;
  }

  const text = await node.getText();

  return text.toLowerCase().includes('welcome');
};
