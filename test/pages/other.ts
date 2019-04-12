import {
  publicTest,
  docTest,
  profileTest,
  passwordTest,
  gamesTest,
  groupsTest,
  searchTest
} from '../test-code/other';
import {
  MAIN_URL,
  DOCS_URL,
  PROFILE_URL,
  PASSWORD_URL,
  login
} from '../helpers';

const VIEW_GAMES = '/[home] see the games they have read+ access to.';
const VIEW_GROUPS = '/[home] see the groups ("Teams") they are a member of.';
const VIEW_DOCS = '/docs access the documentation page.';
const VIEW_PROFILE = '/profile access this page.';
const VIEW_PASSWORD = '/password access this page.';

const USE_SEARCH = 'use the search bar to find a game.';

describe('As a public user', () => {
  it(`I can't ${VIEW_GAMES}`, async () => await publicTest(MAIN_URL));
  it(`I can't ${VIEW_GROUPS}`, async () => await publicTest(MAIN_URL));
  it(`I can't ${VIEW_DOCS}`, async () => await publicTest(DOCS_URL));
  it(`I can't ${VIEW_PROFILE}`, async () => await publicTest(PROFILE_URL));
  it(`I can't ${VIEW_PASSWORD}`, async () => await publicTest(PASSWORD_URL));
});

describe('As a readonly user', () => {
  beforeEach(async () => await login('reader'));
  it(`I can ${VIEW_GAMES}`, gamesTest);
  it(`I can ${VIEW_GROUPS}`, groupsTest);
  it(`I can ${VIEW_DOCS}`, docTest);
  it(`I can ${VIEW_PROFILE}`, profileTest);
  it(`I can ${VIEW_PASSWORD}`, passwordTest);
  it(`I can ${USE_SEARCH}`, searchTest);
});

describe('As a edit capable user', () => {
  beforeEach(async () => await login('editor'));
  it(`I can ${VIEW_GAMES}`, gamesTest);
  it(`I can ${VIEW_GROUPS}`, groupsTest);
  it(`I can ${VIEW_DOCS}`, docTest);
  it(`I can ${VIEW_PROFILE}`, profileTest);
  it(`I can ${VIEW_PASSWORD}`, passwordTest);
  it(`I can ${USE_SEARCH}`, searchTest);
});

describe('As a admin user', () => {
  beforeEach(async () => await login('admin'));
  it(`I can ${VIEW_GAMES}`, gamesTest);
  it(`I can ${VIEW_GROUPS}`, groupsTest);
  it(`I can ${VIEW_DOCS}`, docTest);
  it(`I can ${VIEW_PROFILE}`, profileTest);
  it(`I can ${VIEW_PASSWORD}`, passwordTest);
  it(`I can ${USE_SEARCH}`, searchTest);
});
