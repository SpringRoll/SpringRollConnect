import {
  publicUserTest,
  viewTest,
  viewReleasesTest,
  editGameTest,
  privilegeTest
} from '../test-code/game-slug';
import { login } from '../helpers';
const PAGE = `page - games/[slug]`;

const VIEW = `visit this page, assuming they have read access to this game.`;

const VIEW_RELEASES = `see the button for releases, and use it to go to the releases page.`;

const EDIT = `edit the game's init information`;

const ACCESS_PRIVILEGES = `access the privileges page.`;

describe(`${PAGE} as a public user`, () => {
  it(`I can't access the page`, publicUserTest);
});

describe(`${PAGE} as a read-only user`, () => {
  beforeEach(async () => await login('reader'));
  it(`I can ${VIEW}`, viewTest);
  it(`I can ${VIEW_RELEASES}`, viewReleasesTest);
  it(`I can't ${EDIT}`, async () => editGameTest(false));
  it(`I can't ${ACCESS_PRIVILEGES}`, async () => privilegeTest(false));
});

describe(`${PAGE} as a edit capable user`, () => {
  beforeEach(async () => await login('editor'));
  it(`I can ${VIEW}`, viewTest);
  it(`I can ${VIEW_RELEASES}`, viewReleasesTest);
  it(`I can ${EDIT}`, async () => editGameTest(true));
  it(`I can't ${ACCESS_PRIVILEGES}`, async () => privilegeTest(false));
});

describe(`${PAGE} as a admin user`, () => {
  beforeEach(async () => await login('admin'));
  it(`I can ${VIEW}`, viewTest);
  it(`I can ${VIEW_RELEASES}`, viewReleasesTest);
  it(`I can ${EDIT}`, async () => editGameTest(true));
  it(`I can ${ACCESS_PRIVILEGES}`, async () => privilegeTest(true));
});
