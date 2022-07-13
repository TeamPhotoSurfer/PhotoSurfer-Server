import 'reflect-metadata';
import { ConnectionOptions, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import config from '../config';
const mysql = require ('mysql');

// const dbLoader = async (): Promise<void> => {
//   try {
//     const connectionOption: ConnectionOptions = {
//       type: 'mysql',
//       host: config.host,
//       port: config.dbPort || 3306,
//       username: config.username,
//       password: config.password,
//       database: config.database,
//       synchronize: true, //자동으로 스키마 적용
//       logging: true,
//       entities: ['src/entity/**/*.ts'],
//       migrations: ['src/migration/**/*.ts'],
//       subscribers: ['src/subscriber/**/*.ts'],
//       //   cli: {
//       //     entitiesDir: 'src/entity',
//       //     migrationsDir: 'src/migration',
//       //     subscribersDir: 'src/subscriber',
//       //   },
//       namingStrategy: new SnakeNamingStrategy(),
//     };
//     await createConnection(connectionOption);
//     console.log('Mysql Connected ...');
//   } catch (err) {
//     console.log('db connection error \n', err);
//   }
// };

// const dbLoader = async () => {
//   try{
//     const connection = mysql.createConnection({
//       host: config.host,
//       user: config.username,
//       password: config.password,
//       database: config.database,
//       port: config.dbPort,
//     });

//     await connection.connect();

//     var testQuery = "Select * from `photo`;";

//     var test222 = connection.query(testQuery, function (err: any, results:any, fields:any) { // testQuery 실행
//       if (err) {
//           console.log(err);
//       }
//       console.log(results);
//     });
//     console.log("db connected...");
    
//   }catch (err) {
//     console.log('db connection error \n', err);
//   }
// }

const connection = mysql.createConnection({
  host: config.host,
  user: config.username,
  password: config.password,
  database: config.database,
  port: config.dbPort,
});



export default connection;
