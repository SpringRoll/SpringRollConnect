import { Group } from './models';

export async function makeGroup({
  name = 'test',
  slug = 'test-group',
  token = '45ccb9222588d2c308f5442e08325c020d857daa',
  tokenExpires = null,
  isUserGroup = false,
  privilege = 0
} = {}) {
  return await new Group({
    name,
    slug,
    token,
    tokenExpires,
    isUserGroup,
    privilege
  }).save();
}
