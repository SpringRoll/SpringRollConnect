import { Release } from './models';
export const makeRelease = async (
  game,
  status = 'dev',
  commitId = 'bf408de70afb8c5cd633ff2678c0d0e4d192326f'
) =>
  await new Release({
    game,
    status,
    commitId
  }).save();

// export const addGroupToRelease = async (release, group) => {};
