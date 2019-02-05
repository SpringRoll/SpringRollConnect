import { User } from './models';
import { makeGroup } from './group';

export async function makeUser({
  name = 'Spring Roll',
  username = 'testuser',
  password = 'secret',
  email = 'email@springroll.io',
  groups = [],
  privilege = 2
} = {}) {
  const user = await new User({
    name,
    username,
    password,
    email,
    groups,
    privilege
  }).save();

  user.password = password;
  return user;
}

/**
 * @typedef {object} UserParams
 * @property {string} [UserParams.name]
 * @property {string} [UserParams.username]
 * @property {string} [UserParams.password]
 * @property {string} [UserParams.email]
 * @property {array} [UserParams.groups]
 *
 *
 * @typedef {object} GroupParams
 * @property {string} [GroupParams.name]
 * @property {string} [GroupParams.token]
 * @property {string} [GroupParams.slug]
 * @property {*} [GroupParams.tokenExpires]
 * @property {boolean} [GroupParams.isUserGroup]
 * @property {0 | 1 | 2} [GroupParams.privilege]
 */

/**
 *
 *
 * @param {UserParams} userParams
 * @param {GroupParams} groupParams
 */
export async function makeUserWithGroup(userParams = {}, groupParams = {}) {
  const group = await makeGroup(
    Object.assign({}, { isUserGroup: true, privilege: 0 }, groupParams)
  );
  const user = await makeUser(
    Object.assign({}, userParams, { groups: [group._id] })
  );

  return { user, group };
}
