import { createConnections, Connection } from 'typeorm';
import * as mEntities from '../db/entities';
import * as pEntities from '../db/entities-post';
import combos from 'combos';
import { isEqual } from 'lodash';
const values = [true, false];
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
    constants(postgres)
    .then(result => capabilities(result, postgres).then(result => {
      mongo.getMongoRepository(mEntities.User).find(),
      mongo.getMongoRepository(mEntities.Group).find(),
      mongo.getMongoRepository(mEntities.Game).find(),
      mongo.getMongoRepository(mEntities.Release).find()
    });
//         ])
//     )
//     .then(
//       ([capabilities, users, allGroups, games, releases]: [
//         any,
//         mEntities.User[],
//         mEntities.Group[],
//         any,
//         any
//       ]) => {
//         postgres
//           .getRepository(pEntities.Group)
//           .save(allGroups.map(group => {
//             const { id, ...g } = group;
//             return g;
//           }) as any)
//           .then((newGroups: pEntities.Group[]) => {
//             const newUsers = users.map(data => {
//               const { id, groups, ...user } = data;

//               const mappedGroups = groups.map(userGroup => {
//                 const match = allGroups.find(
//                   group => group.id.toString() === userGroup.toString()
//                 );
//                 return newGroups.find(g => g.slug === match.slug);
//               });

//               (<any>user).groups = mappedGroups;

//               return user;
//             });
//             postgres
//               .getRepository(pEntities.User)
//               .save(newUsers)
//               .then(data => {});
//           });
//         // console.log(capabilities);
//       }
//     );
// });

function constants(postgres: Connection) {
  return Promise.all([
    postgres.getRepository(pEntities.Sizes).save(
      combos({
        xsmall: values,
        small: values,
        medium: values,
        large: values,
        xlarge: values
      })
    ),
    postgres.getRepository(pEntities.Features).save(
      combos({
        webworkers: values,
        websockets: values,
        webaudio: values,
        geolocation: values,
        webgl: values
      })
    ),
    postgres.getRepository(pEntities.Ui).save(
      combos({
        touch: values,
        mouse: values
      })
    )
  ]);
}

function capabilities([sizes, features, ui]: [
  pEntities.Sizes[],
  pEntities.Features[],
  pEntities.Ui[]
], postgres: Connection) {
  postgres.getRepository(pEntities.Capabilities).save(
          combos({
            sizes: sizes,
            features: features,
            ui
          })
}
