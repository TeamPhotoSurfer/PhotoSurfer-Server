import 'reflect-metadata';
import { ConnectionOptions, createConnection } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import config from '../config';

const dbLoader = async (): Promise<void> => {
  try {
    const connectionOption: ConnectionOptions = {
      type: 'mysql',
      host: config.host,
      port: config.dbPort || 3306,
      username: config.username,
      password: config.password,
      database: config.database,
      synchronize: true, //자동으로 스키마 적용
      logging: true,
      entities: ['src/entity/**/*.ts'],
      migrations: ['src/migration/**/*.ts'],
      subscribers: ['src/subscriber/**/*.ts'],
      //   cli: {
      //     entitiesDir: 'src/entity',
      //     migrationsDir: 'src/migration',
      //     subscribersDir: 'src/subscriber',
      //   },
      namingStrategy: new SnakeNamingStrategy(),
    };
    await createConnection(connectionOption);
    console.log('Mysql Connected ...');
  } catch (err) {
    console.log('db connection error \n', err);
  }
};

export default dbLoader;
