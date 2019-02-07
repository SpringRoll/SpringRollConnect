import { Release, Game } from './models';
export const makeRelease = async (
  { _id },
  status = 'dev',
  commitId = 'bf408de70afb8c5cd633ff2678c0d0e4d192326f',
  notes = 'Test Release'
) =>
  await new Release({
    game: _id,
    status,
    commitId,
    notes
  })
    .save()
    .then(async release => {
      await Game.updateOne({ _id }, { $push: { releases: release } });
      return release;
    });
