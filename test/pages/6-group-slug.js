import {
  publicTest,
  viewGroup,
  addUser,
  removeUser,
  addGame,
  removeGame,
  refreshToken,
  edit
} from '../test-code/6-group-slug';
const ADD_GAME = 'Add a game to a group';
const ADD_USER = 'Add a user to a group';
const EDIT = 'Edit a group';
const REFRESH_TOKEN = 'Refresh a token';
const REMOVE_GAME = 'Remove a game from a group';
const REMOVE_USER = 'Remove a user from a group';
const VIEW = 'View a group';
const PAGE = 'page - groups/[slug]';

describe(`${PAGE} as a public user`, () => {
  it(`I can't access the page`, publicTest);
});

describe(`${PAGE} as a read-only user`, () => {
  it(`I can ${VIEW} I'm in`, async () =>
    await viewGroup({ inGroup: true, privilege: 0 }));
  it(`I can't ${VIEW} I'm not in`, async () =>
    await viewGroup({ inGroup: false, privilege: 1 }));
  it(`I can't ${ADD_GAME}`, async () =>
    await addGame({ inGroup: true, privilege: 0 }));
  it(`I can't ${ADD_USER}`, async () =>
    await addUser({ inGroup: true, privilege: 0 }));
  it(`I can't ${EDIT}`, async () =>
    await edit({ inGroup: true, privilege: 0 }));
  it(`I can't ${REFRESH_TOKEN}`, async () =>
    await refreshToken({ inGroup: true, privilege: 0 }));
  it(`I can't ${REMOVE_GAME}`, async () =>
    await removeGame({ inGroup: true, privilege: 0 }));
  it(`I can't ${REMOVE_USER}`, async () =>
    await removeUser({ inGroup: true, privilege: 0 }));
});

describe(`${PAGE} as a edit capable user`, () => {
  it(`I can ${VIEW} I'm in`, async () =>
    await viewGroup({ inGroup: true, privilege: 1 }));
  it(`I can't ${VIEW} I'm not in`, async () =>
    await viewGroup({ inGroup: false, privilege: 1 }));
  it(`I can't ${ADD_GAME}`, async () =>
    await addGame({ inGroup: true, privilege: 1 }));
  it(`I can't ${ADD_USER}`, async () =>
    await addUser({ inGroup: true, privilege: 1 }));
  it(`I can't ${EDIT}`, async () =>
    await edit({ inGroup: true, privilege: 1 }));
  it(`I can't ${REFRESH_TOKEN}`, async () =>
    await refreshToken({ inGroup: true, privilege: 1 }));
  it(`I can't ${REMOVE_GAME}`, async () =>
    await removeGame({ inGroup: true, privilege: 1 }));
  it(`I can't ${REMOVE_USER}`, async () =>
    await removeUser({ inGroup: true, privilege: 1 }));
});

describe(`${PAGE} as a admin user`, () => {
  it(`I can ${VIEW} I'm in`, async () =>
    await viewGroup({ inGroup: true, privilege: 2 }));
  it(`I can ${VIEW} I'm not in`, async () =>
    await viewGroup({ inGroup: false, privilege: 2 }));
  it(`I can ${ADD_GAME}`, async () =>
    await addGame({ inGroup: false, privilege: 2 }));
  it(`I can ${ADD_USER}`, async () =>
    await addUser({ inGroup: false, privilege: 2 }));
  it(`I can ${EDIT}`, async () => await edit({ inGroup: false, privilege: 2 }));
  it(`I can ${REFRESH_TOKEN}`, async () =>
    await refreshToken({ inGroup: false, privilege: 2 }));
  it(`I can ${REMOVE_GAME}`, async () =>
    await removeGame({ inGroup: false, privilege: 2 }));
  it(`I can ${REMOVE_USER}`, async () =>
    await removeUser({ inGroup: false, privilege: 2 }));
});
