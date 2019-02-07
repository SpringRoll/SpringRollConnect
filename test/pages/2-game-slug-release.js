// import {
//   gameReleasesURL,
//   Selenium,
//   logout,
//   createUserGroupGameRelease,
//   isLoginPage,
//   login,
//   MAIN_TITLE,
//   sleep
// } from '../helpers';
// import { expect } from 'chai';
// import { By, until } from 'selenium-webdriver';
// const page = 'page - games/game/[slug]/releases';
// const CHANGE_TEST = 'change the promotion level of a game (e.g. DEV to PROD)';
// const ADD_TEST = 'add a release';
// const VIEW_TEST = 'view all releases';
// const DELETE_TEST = 'delete a release';
// const EDIT_TEST = 'edit a release';
// const DOWNLOAD_TEST = 'download release zips';

// describe(`${page} as a public user`, () => {
//   const test = async () => {
//     const { game } = await createUserGroupGameRelease();
//     await logout();
//     const url = gameReleasesURL(game);
//     await Selenium.Browser.get(url);
//     expect(await isLoginPage()).to.be.true;
//   };
//   it(`I can't ${CHANGE_TEST}`, test);
//   it(`I can't ${ADD_TEST}`, test);
//   it(`I can't ${VIEW_TEST}`, test);
//   it(`I can't ${DELETE_TEST}`, test);
//   it(`I can't ${EDIT_TEST}`, test);
//   it(`I can't ${DOWNLOAD_TEST}`, test);
// });

// describe(`${page} as a read-only user`, () => {
//   const basic = async () => {
//     const { user, game } = await createUserGroupGameRelease({
//       permission: 2,
//       gameStatus: 'prod'
//     });
//     await logout();
//     const url = gameReleasesURL(game);
//     console.log(url);
//     await login(user);
//     await Selenium.Browser.wait(until.titleIs(MAIN_TITLE));

//     // await sleep(1000 * 10);
//     // console.log(url);
//     await Selenium.Browser.get(url);

//     await Selenium.Browser.get(url);
//     // await Selenium.Browser.wait(
//     //   until.titleIs(`${game.title} - Game - ${MAIN_TITLE}`)
//     // );

//     // const text = await Selenium.Browser.findElement(
//     //   By.className('panel-title')
//     // ).getText();

//     // expect(text).to.equal('Releases');
//   };
//   it(`I can't ${CHANGE_TEST}`, async () => {
//     await basic();
//   });
//   it(`I can't ${ADD_TEST}`, async () => {
//     await basic();
//   });
//   it(`I can ${VIEW_TEST}`, async () => {
//     await basic();
//   });
//   it(`I can't ${DELETE_TEST}`, async () => {
//     await basic();
//   });
//   it(`I can't ${EDIT_TEST}`, async () => {
//     await basic();
//   });
//   it(`I can ${DOWNLOAD_TEST}`, async () => {
//     await basic();
//   });
// });

// describe(`${page} as a edit capable user`, () => {
//   it(`I can ${CHANGE_TEST}`, async () => {});
//   it(`I can ${ADD_TEST}`, async () => {});
//   it(`I can ${VIEW_TEST}`, async () => {});
//   it(`I can ${DELETE_TEST}`, async () => {});
//   it(`I can ${EDIT_TEST}`, async () => {});
//   it(`I can ${DOWNLOAD_TEST}`, async () => {});
// });

// describe(`${page} as a admin user`, () => {
//   it(`I can ${CHANGE_TEST}`, async () => {});
//   it(`I can ${ADD_TEST}`, async () => {});
//   it(`I can ${VIEW_TEST}`, async () => {});
//   it(`I can ${DELETE_TEST}`, async () => {});
//   it(`I can ${EDIT_TEST}`, async () => {});
//   it(`I can ${DOWNLOAD_TEST}`, async () => {});
// });
