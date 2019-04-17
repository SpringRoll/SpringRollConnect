import { createConnection } from 'typeorm';
import data from '../test/testSQL';

createConnection().then(connection => {
  connection.synchronize(true).then(() => connection.query(data));
});
