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
const CHANGE = 'change the promotion level of a game (e.g. DEV to PROD)';
const ADD = 'add a release';
const VIEW = 'view all releases';
const DELETE = 'delete a release';
const EDIT = 'edit a release';
const DOWNLOAD = 'download release zips';

describe(`${PAGE} as a public user`, () => {
  it(`I can't access releases`, publicUserTest);
});

//TODO: Fix read-only user permissions so they can view releases page
// describe(`${PAGE} as a read-only user`, () => {
//   beforeEach(async () => await basic(0, 0, 'dev'));
//   it(`I can ${VIEW}`, () => {});
//   it(`I can ${CHANGE}`, async () => await changeTest(false));
//   it(`I can ${DOWNLOAD}`, downloadTest);
//   it(`I can ${EDIT}`, async () => await editTest(false));
//   it(`I can ${ADD}`, async () => await addReleaseTest(false));
//   it(`I can ${DELETE}`, async () => await deleteReleaseTest(false));
// });

describe(`${PAGE} as a edit capable user`, () => {
  beforeEach(async () => await basic(1, 1, 'dev'));
  it(`I can ${VIEW}`, () => {});
  it(`I can ${CHANGE}`, async () => await changeTest(true));
  it(`I can ${DOWNLOAD}`, downloadTest);
  it(`I can ${EDIT}`, async () => await editTest(true));
  it(`I can ${ADD}`, async () => await addReleaseTest(true));
  it(`I can ${DELETE}`, async () => await deleteReleaseTest(true));
});

describe(`${PAGE} as a admin user`, () => {
  beforeEach(async () => await basic(2, 2, 'dev'));
  it(`I can ${VIEW}`, () => {});
  it(`I can ${CHANGE}`, async () => await changeTest(true));
  it(`I can ${DOWNLOAD}`, downloadTest);
  it(`I can ${EDIT}`, async () => await editTest(true));
  it(`I can ${ADD}`, async () => await addReleaseTest(true));
  it(`I can ${DELETE}`, async () => await deleteReleaseTest(true));
});
