import { createConnection } from 'typeorm';
import entities from './entities';
export default createConnection({
  type: 'mongodb',
  host: 'localhost',
  port: 27017,
  database: 'connect',
  entities
});
