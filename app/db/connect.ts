import { createConnection } from 'typeorm';
import * as entities from './entities';
export default createConnection({
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'connect',
  entities: Object.values(entities)
});
