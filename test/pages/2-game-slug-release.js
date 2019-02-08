import {
  basic,
  changeTest,
  downloadTest,
  editTest,
  publicUserTest,
  addReleaseTest,
  deleteReleaseTest
} from '../test-code/2-game-slug-release';
const PAGE = 'page - games/game/[slug]/releases';
const CHANGE_TEST = 'change the promotion level of a game (e.g. DEV to PROD)';
const ADD_TEST = 'add a release';
const VIEW_TEST = 'view all releases';
const DELETE_TEST = 'delete a release';
const EDIT_TEST = 'edit a release';
const DOWNLOAD_TEST = 'download release zips';

describe(`${PAGE} as a public user`, () => {
  it(`I can't access releases`, publicUserTest);
});

//TODO: Fix read-only user permissions so they can view releases page
// describe(`${PAGE} as a read-only user`, () => {
//   beforeEach(async () => await basic(0, 0, 'dev'));
//   it(`I can ${VIEW_TEST}`, () => {});
//   it(`I can ${CHANGE_TEST}`, async () => await changeTest(false));
//   it(`I can ${DOWNLOAD_TEST}`, downloadTest);
//   it(`I can ${EDIT_TEST}`, async () => await editTest(false));
//   it(`I can ${ADD_TEST}`, async () => await addReleaseTest(false));
//   it(`I can ${DELETE_TEST}`, async () => await deleteReleaseTest(false));
// });

describe(`${PAGE} as a edit capable user`, () => {
  beforeEach(async () => await basic(1, 1, 'dev'));
  it(`I can ${VIEW_TEST}`, () => {});
  it(`I can ${CHANGE_TEST}`, async () => await changeTest(true));
  it(`I can ${DOWNLOAD_TEST}`, downloadTest);
  it(`I can ${EDIT_TEST}`, async () => await editTest(true));
  it(`I can ${ADD_TEST}`, async () => await addReleaseTest(true));
  it(`I can ${DELETE_TEST}`, async () => await deleteReleaseTest(true));
});

describe(`${PAGE} as a admin user`, () => {
  beforeEach(async () => await basic(2, 2, 'dev'));
  it(`I can ${VIEW_TEST}`, () => {});
  it(`I can ${CHANGE_TEST}`, async () => await changeTest(true));
  it(`I can ${DOWNLOAD_TEST}`, downloadTest);
  it(`I can ${EDIT_TEST}`, async () => await editTest(true));
  it(`I can ${ADD_TEST}`, async () => await addReleaseTest(true));
  it(`I can ${DELETE_TEST}`, async () => await deleteReleaseTest(true));
});
