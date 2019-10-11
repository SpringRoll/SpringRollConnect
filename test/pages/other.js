import {
  publicTest,
  docTest,
  init,
  profileTest,
  passwordTest,
  gamesTest,
  groupsTest,
  searchTest,
  versionToCommitTest
} from '../test-code/other';
import { MAIN_URL, DOCS_URL, PROFILE_URL, PASSWORD_URL } from '../helpers';

const VIEW_GAMES = '/[home] see the games they have read+ access to.';
const VIEW_GROUPS = '/[home] see the groups ("Teams") they are a member of.';
const VIEW_DOCS = '/docs access the documentation page.';
const VIEW_PROFILE = '/profile access this page.';
const VIEW_PASSWORD = '/password access this page.';

const USE_SEARCH = 'use the search bar to find a game.';
const VIEW_COMMIT_ID = 'reveal the commit ID of the current version.';

describe('As a admin user', () => {
  beforeEach(async () => await init(2));
  it(`I can ${VIEW_COMMIT_ID}`, versionToCommitTest);
  it(`I can ${VIEW_GAMES}`, gamesTest);
  it(`I can ${VIEW_GROUPS}`, groupsTest);
  it(`I can ${VIEW_DOCS}`, docTest);
  it(`I can ${VIEW_PROFILE}`, profileTest);
  it(`I can ${VIEW_PASSWORD}`, passwordTest);
  it(`I can ${USE_SEARCH}`, searchTest);
});

describe('As a public user', () => {
  it(`I can't ${VIEW_GAMES}`, async () => await publicTest(MAIN_URL));
  it(`I can't ${VIEW_GROUPS}`, async () => await publicTest(MAIN_URL));
  it(`I can't ${VIEW_DOCS}`, async () => await publicTest(DOCS_URL));
  it(`I can't ${VIEW_PROFILE}`, async () => await publicTest(PROFILE_URL));
  it(`I can't ${VIEW_PASSWORD}`, async () => await publicTest(PASSWORD_URL));
});

describe('As a readonly user', () => {
  beforeEach(async () => await init(0));
  it(`I can ${VIEW_GAMES}`, gamesTest);
  it(`I can ${VIEW_GROUPS}`, groupsTest);
  it(`I can ${VIEW_DOCS}`, docTest);
  it(`I can ${VIEW_PROFILE}`, profileTest);
  it(`I can ${VIEW_PASSWORD}`, passwordTest);
  it(`I can ${USE_SEARCH}`, searchTest);
});

describe('As a edit capable user', () => {
  beforeEach(async () => await init(1));
  it(`I can ${VIEW_GAMES}`, gamesTest);
  it(`I can ${VIEW_GROUPS}`, groupsTest);
  it(`I can ${VIEW_DOCS}`, docTest);
  it(`I can ${VIEW_PROFILE}`, profileTest);
  it(`I can ${VIEW_PASSWORD}`, passwordTest);
  it(`I can ${USE_SEARCH}`, searchTest);
});
