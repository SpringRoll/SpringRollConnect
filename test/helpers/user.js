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
 * @typedef {object} GroupParams
 * @property {boolean} [GroupParams.isUserGroup]
 * @property {0 | 1 | 2} [GroupParams.privilege]
 * @property {Array<*>} [GroupParams.groups]
 */

/**
 *
 *
 * @param {GroupParams} groupParams
 */
export async function makeUserWithGroup({
  isUserGroup = true,
  privilege = 0,
  groups = []
} = {}) {
  const group = await makeGroup({ isUserGroup, privilege });
  const user = await makeUser({ groups: [group._id, ...groups] });

  return { user, group };
}
