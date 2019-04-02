import { createConnection } from 'typeorm';
import * as entities from './entities';

export default createConnection({
  type: 'postgres',
  host: 'postgres',
  port: 5432,
  database: 'backup',
  entities: Object.values(entities),
  username: 'postgres'
});
