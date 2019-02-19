import { init, viewTest, editTest, addTest } from '../test-code/users';

const PAGE = 'page - users';
const VIEW = 'access this page.';
const ADD = 'add a new user.';
const EDIT = `select a user from the dropdown and edit their information.`;

describe(`${PAGE} as a public user`, () => {
  it(`I can't access the page`, async () => await init());
});

describe(`${PAGE} as a read-only user`, () => {
  it(`I can't access the page`, async () => await init(0));
});

describe(`${PAGE} as a edit capable user`, () => {
  it(`I can't access the page`, async () => await init(1));
});

describe(`${PAGE} as a admin user`, () => {
  beforeEach(async () => await init(2));

  it(`I can ${VIEW}`, viewTest);
  it(`I can ${ADD}`, addTest);
  it(`I can ${EDIT}`, editTest);
});
