import { basic, addGroup } from '../test-code/7-group';
const PAGE = 'page - groups';
const VIEW = 'View all groups';
const ADD = 'Add a group';

describe(`${PAGE} as a public user`, () => {
  it(`I can't access the page`, async () => await basic());
});

describe(`${PAGE} as a read-only user`, () => {
  it(`I can't access the page`, async () => await basic(0));
});

describe(`${PAGE} as a edit capable user`, () => {
  it(`I can't access the page`, async () => await basic(1));
});

describe(`${PAGE} as a admin user`, () => {
  it(`I can ${VIEW}`, async () => await basic(2));
  it(`I can ${ADD}`, addGroup);
});
