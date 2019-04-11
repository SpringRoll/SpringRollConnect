import { viewTest, editTest, addTest } from '../test-code/users';
import { login } from '../helpers';

const PAGE = 'page - users';
const VIEW = 'access this page.';
const ADD = 'add a new user.';
const EDIT = `select a user from the dropdown and edit their information.`;

describe(`${PAGE} as a public user`, () => {
  it(`I can't access the page`, async () => viewTest(false));
});

describe(`${PAGE} as a read-only user`, () => {
  beforeEach(async () => login('reader'));
  it(`I can't access the page`, async () => viewTest(false));
});

describe(`${PAGE} as a edit capable user`, () => {
  beforeEach(async () => login('editor'));
  it(`I can't access the page`, async () => viewTest(false));
});

describe(`${PAGE} as a admin user`, () => {
  beforeEach(async () => await login('admin'));

  it(`I can ${VIEW}`, async () => viewTest(true));
  it(`I can ${ADD}`, addTest);
  it(`I can ${EDIT}`, editTest);
});
