import { publicTest, view, addGroup } from '../test-code/group';
import { login } from '../helpers';
const PAGE = 'page - groups';
const VIEW = 'View all groups';
const ADD = 'Add a group';

describe(`${PAGE} as a public user`, () => {
  it(`I can't access the page`, async () => await publicTest());
});

describe(`${PAGE} as a read-only user`, () => {
  beforeEach(async () => login('reader'));
  it(`I can access the page`, async () => await view(true));
});

describe(`${PAGE} as a edit capable user`, () => {
  beforeEach(async () => login('editor'));
  it(`I can access the page`, async () => await view(true));
});

describe(`${PAGE} as a admin user`, () => {
  beforeEach(async () => login('admin'));
  it(`I can ${VIEW}`, async () => await view(true));
  it(`I can ${ADD}`, addGroup);
});
