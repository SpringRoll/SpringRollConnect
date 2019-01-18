import { createConnections } from 'typeorm';
import * as mEntities from '../db/entities';
import * as pEntities from '../db/entities-post';
import { uniqBy } from 'lodash';

function mapUserGroups(
  groups: any,
  mGroups: mEntities.Group[],
  pGroups: pEntities.Group[]
) {
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
]).then(([mongo, postgres]) => {
  Promise.all([
    mongo.getMongoRepository(mEntities.User).find(),
    mongo.getMongoRepository(mEntities.Group).find(),
    mongo.getMongoRepository(mEntities.Game).find(),
    mongo.getMongoRepository(mEntities.Release).find()
  ]).then(([mUsers, mGroups, mGames, mReleases]) => {
    //GROUPS
    postgres
      .getRepository(pEntities.Group)
      .save(mGroups.map(group => {
        const { id, ...g } = group;
        return g;
      }) as any)
      //USERS
      .then((pGroups: pEntities.Group[]) => {
        const pUsers = mUsers.map(data => {
          const { id, groups, ...user } = data;

          (<any>user).groups = mapUserGroups(groups, mGroups, pGroups);

          return user;
        });
        postgres
          .getRepository(pEntities.User)
          .save(pUsers)
          .then(() => {
            const pGameRepository = postgres.getRepository(pEntities.Game);
            const games = mGames.map(mGame => {
              const { id, thumbnail, releases, groups, ...game } = mGame;
              (<any>game).thumbnail = thumbnail ? thumbnail.value() : undefined;
              return game;
            });
            pGameRepository.save(games).then(pGames => {
              mGames.map(({ groups }) => {
                const g = groups.map(({ group }) => group);
                const x = mapUserGroups(g, mGroups, pGroups).map(
                  ({ id, slug, privilege }) => ({ id, slug, privilege })
                );

                // const x = mapGameGroups(g, mGroups, pGroups);
                console.log(x);
              });
            });
            // const pGames = pGameRepository.find();
            //   const groupPermissions = mGames.map(mGame => {
            //     const { groups = [] } = mGame;
            //     return mapGroups(groups, mGroups, pGroups, true);
            //   });

            //   postgres
            //     .getRepository(pEntities.GroupPermission)
            //     .save(groupPermissions)
            //     .then(() => console.log('success'))
            //     .catch(err => console.log(err));
            // });
          });
      });
  });
});
