import {
  init,
  publicUserTest,
  viewTest,
  viewReleasesTest,
  editGameTest,
  privilegeTest
} from '../test-code/game-slug';
const PAGE = `page - games/[slug]`;

const VIEW = `visit this page, assuming they have read access to this game.`;

const VIEW_RELEASES = `see the button for releases, and use it to go to the releases page.`;

const EDIT = `edit the game's init information`;

const ACCESS_PRIVILEGES = `access the privileges page.`;

describe(`${PAGE} as a public user`, () => {
  it(`I can't access the page`, publicUserTest);
});

// TODO: Fix read-only user permissions so they can view releases page
// describe(`${PAGE} as a read-only user`, () => {
//   beforeEach(async () => await init(0, 0, 'prod'));
//   it(`I can ${VIEW}`, () => {});
//   it(`I can ${VIEW_RELEASES}`, () => {});
//   it(`I can't ${EDIT}`, () => {});
//   it(`I can't ${ACCESS_PRIVILEGES}`, () => {});
// });

describe(`${PAGE} as a edit capable user`, () => {
  beforeEach(async () => await init(1, 1, 'dev'));
  it(`I can ${VIEW}`, viewTest);
  it(`I can ${VIEW_RELEASES}`, viewReleasesTest);
  it(`I can ${EDIT}`, editGameTest);
  //TODO: Fix permissions to allow for edit capable users to view
  // it(`I can ${ACCESS_PRIVILEGES}`, privilegeTest);
});

describe(`${PAGE} as a admin user`, () => {
  beforeEach(async () => await init(2, 2, 'dev'));
  it(`I can ${VIEW}`, viewTest);
  it(`I can ${VIEW_RELEASES}`, viewReleasesTest);
  it(`I can ${EDIT}`, editGameTest);
  //TODO: Fix permissions so that a Admin can view privileges
  // it(`I can ${ACCESS_PRIVILEGES}`, privilegeTest);
});
