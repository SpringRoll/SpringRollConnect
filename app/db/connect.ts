import { createConnections } from 'typeorm';
import * as entities from './entities';
import * as post from './entities-post';
export default createConnections([
  {
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    database: 'connect',
    entities: Object.values(entities)
  },
  {
    name: 'postgres',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'connect',
    entities: Object.values(post),
    synchronize: true,
    username: 'postgres'
  }
]);
