import 'reflect-metadata';
import config from '../config';
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
  port: config.dbPort,
});

export default connection;
