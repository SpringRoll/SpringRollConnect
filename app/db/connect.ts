import { createConnection } from 'typeorm';
import * as entities from './entities';

export default createConnection({
  type: 'postgres',
  host: process.env['DB_HOST'],
  port: 5432,
  database: process.env['DB'],
  entities: Object.values(entities),
  username: process.env['DB_USER'],
  password: process.env['DB_PASSWORD']
});
