import { createConnections } from 'typeorm';
import * as mEntities from './entities';
import * as pEntities from '../db/entities';
import { uniqBy } from 'lodash';

function mapUserGroups(
  groups: any,
  mGroups: mEntities.Group[],
  pGroups: pEntities.Group[]
): { id: number; slug: string; privilege: number }[] {
  const userMongoGroups = groups
    .map(group =>
      mGroups.find(mGroup => mGroup.id.toString() === group.toString())
    )

    .filter(group => 'undefined' !== typeof group);
  return uniqBy(
    userMongoGroups.map(mGroup =>
      pGroups.find(pGroup => pGroup.slug === mGroup.slug)
    ),
    group => (<any>group).slug
  );
}

createConnections([
  {
    name: 'mongo',
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'connect',
    entities: Object.values(mEntities)
  },
  {
    name: 'postgres',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'connect',
    entities: Object.values(pEntities),
    synchronize: true,
    username: 'postgres',
    dropSchema: true
  }
]).then(async ([mongo, postgres]) => {
  const [mUsers, mGroups, mGames, mReleases, mConfigs] = await Promise.all([
    mongo.getMongoRepository(mEntities.User).find(),
    mongo.getMongoRepository(mEntities.Group).find(),
    mongo.getMongoRepository(mEntities.Game).find(),
    mongo.getMongoRepository(mEntities.Release).find(),
    mongo.getMongoRepository(mEntities.Config).find()
  ]);

  const configRepo = postgres.getRepository(pEntities.Config);

  await configRepo.save(configRepo.create(mConfigs));

  //GROUPS
  const pGroups: pEntities.Group[] = await postgres
    .getRepository(pEntities.Group)
    .save(mGroups.map(group => {
      const { id, logo, ...g } = group;
      (<any>g).logo = logo ? logo.value() : undefined;
      return g;
    }) as any);
  //USERS
  const pUsers = mUsers.map(data => {
    const { id, groups, ...user } = data;

    (<any>user).groups = mapUserGroups(groups, mGroups, pGroups);

    return user;
  });
  await postgres.getRepository(pEntities.User).save(pUsers);

  //GAMES
  const pGameRepository = postgres.getRepository(pEntities.Game);
  const games = mGames.map(mGame => {
    const { id, thumbnail, releases, groups, bundleId, ...game } = mGame;
    (<any>game).thumbnail = thumbnail ? thumbnail.value() : undefined;
    return game;
  });

  const pGames: pEntities.Game[] = <pEntities.Game[]>(
    await pGameRepository.save(<pEntities.Game[]>games)
  );

  //GROUP PERMISSIONS
  const mappedGroups = mGames.flatMap(({ slug, groups }) => {
    const g = groups.map(({ group }) => group);
    return mapUserGroups(g, mGroups, pGroups).map(({ id, privilege }) => ({
      id,
      privilege,
      slug
    }));
  });

  const permissions = pGames.flatMap((game: pEntities.Game) =>
    mappedGroups
      .filter(g => g.slug === game.slug)
      .map(({ id, privilege }) => ({
        permission: privilege,
        game: { uuid: game.uuid },
        group: { id }
      }))
  );

  await postgres.getRepository(pEntities.GroupPermission).save(permissions);
  const pRelease = postgres.getRepository(pEntities.Release);

  const releases = mReleases
    .map(release => {
      const gameID = release.game.toString();
      const found = mGames.find(
        ({ releases }) =>
          'undefined' !== typeof releases.find(r => r.toString() === gameID)
      );
      if ('undefined' !== typeof found) {
        const { uuid } = pGames.find(game => game.slug === found.slug);
        //@ts-ignore;
        release.game = { uuid };

        return release;
      }
    })
    .filter(release => release)
    .map(release => {
      if ('undefined' === typeof release.updatedBy) {
        return release;
      }

      //@ts-ignore
      release.updatedBy = mUsers.find(
        user => user.id.toString() === release.updatedBy.toString()
      );

      if ('undefined' === typeof release.updatedBy) {
        return release;
      }

      //@ts-ignore
      release.updatedBy = pUsers.find(
        //@ts-ignore
        user => user.username === release.updatedBy.username
      );

      return release;
    })
    .map(r => pRelease.create(<object>r));

  await postgres
    .getRepository(pEntities.Release)
    .save(releases)
    .catch(err => console.log(err));

  mongo.close();
  postgres.close();
  return;
});
