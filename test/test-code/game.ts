import { browser, GAMES_URL, isLoginPage } from '../helpers';
import { until, By, error } from 'selenium-webdriver';
import { expect } from 'chai';
import { viewTest as gameViewTest } from './game-slug';
const slug = 'empty-game';
const name = 'Empty Game';

const { NoSuchElementError } = error;

export const publicUserTest = async () => {
  await browser.get(GAMES_URL);

  await isLoginPage();
};

export const viewTest = async () => {
  await browser.get(GAMES_URL);
  const gameTitle = await browser.wait(
    until.elementLocated(By.css(`a[href="/games/${slug}"] .title`)),
    500
  );

  expect(await gameTitle.getText()).to.equal(name);

  return gameTitle;
};

export const viewDetailsTest = async () => {
  await browser.get(GAMES_URL);
  await browser
    .wait(until.elementLocated(By.css(`a[href="/games/${slug}"]`)), 500)
    .click();

  await gameViewTest();
};

export const addGameTest = async pass => {
  await browser.get(GAMES_URL);
  const gameCount = await browser
    .wait(until.elementsLocated(By.css('span.title')), 500)
    .then(elements => elements.length);

  const addGameButton = await browser
    .findElement(By.css('a[href="/games/add"]'))
    .catch(err => err);

  if (!pass) {
    expect(addGameButton).to.be.instanceOf(NoSuchElementError);
    return;
  }

  const oldTitle = await browser.findElement(By.css('h3.panel-title'));

  await addGameButton.click();
  await browser.wait(until.stalenessOf(oldTitle));

  const panelTitle = await browser.wait(
    until.elementLocated(By.css('h3.panel-title'))
  );

  expect(await panelTitle.getText()).to.equal('Add New Game');

  const [title, slug, repository, location, description] = await Promise.all([
    browser.findElement(By.id('title')),
    browser.findElement(By.id('slug')),
    browser.findElement(By.id('repository')),
    browser.findElement(By.id('location')),
    browser.findElement(By.id('description'))
  ]);

  await Promise.all([
    title.sendKeys('Foo Game'),
    slug.sendKeys('foo-game'),
    repository.sendKeys('www.localhost.ca'),
    location.sendKeys('www.localhost.ca'),
    description.sendKeys('Foo Game')
  ]);

  const submit = await browser.findElement(By.css('button[type="submit"]'));

  await submit.click();

  const success = await browser.wait(
    until.elementLocated(By.css('div.alert.alert-success')),
    500
  );

  expect(await success.isDisplayed()).to.be.true;

  await browser.get(GAMES_URL);

  const games = await browser.wait(
    until.elementsLocated(By.css('span.title')),
    500
  );

  expect(games.length).to.equal(gameCount + 1);
};
