import { Release, Game } from './models';
import { makeRandomString } from './util';
export const makeRelease = async (
  { _id },
  status = 'dev',
  commitId = makeRandomString(40),
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
