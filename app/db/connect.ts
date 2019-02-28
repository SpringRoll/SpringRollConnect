import { createConnection } from 'typeorm';
import * as entities from './entities';

export default createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'connect',
  entities: Object.values(entities),
  username: 'postgres'
});
