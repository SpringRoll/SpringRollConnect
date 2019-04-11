import {
  viewTest,
  publicUserTest,
  viewDetailsTest,
  addGameTest
} from '../test-code/game';
import { login } from '../helpers';
const VIEW_GAMES = `see games that I have read permissions for.`;
const VIEW_DETAILS = `click on games that they have read+ permissions for, and be taken to that game's /game/[slug] page.`;
const ADD_GAME = `add a new game entry.`;
const PAGE = `page - games`;
describe(`${PAGE} as a public user`, () => {
  it(`I can't access the page`, publicUserTest);
});

describe(`${PAGE} as a read-only user`, () => {
  beforeEach(async () => login('reader'));
  it(`I can ${VIEW_GAMES}`, viewTest);
  it(`I can ${VIEW_DETAILS}`, viewDetailsTest);
  it(`I can't ${ADD_GAME}`, async () => await addGameTest(false));
});

describe(`${PAGE} as a edit capable user`, () => {
  beforeEach(async () => login('editor'));
  it(`I can ${VIEW_GAMES}`, viewTest);
  it(`I can ${VIEW_DETAILS}`, viewDetailsTest);
  it(`I can ${ADD_GAME}`, async () => await addGameTest(true));
});

describe(`${PAGE} as a admin user`, () => {
  beforeEach(async () => login('admin'));
  it(`I can ${VIEW_GAMES}`, viewTest);
  it(`I can ${VIEW_DETAILS}`, viewDetailsTest);
  it(`I can ${ADD_GAME}`, async () => await addGameTest(true));
});
