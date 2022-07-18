import dotenv from "dotenv";

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process

  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT as string, 10) as number,

  /**
   * MongoDB URI
   */
  // mongoURI: process.env.MONGODB_URI as string,
  //
  /**
   * DB host
   */
  // host: process.env.DB_HOST,

  /**
   * DB port
  //  */
  // dbPort: parseInt(process.env.DB_PORT as string, 10) as number,

  // /**
  //  * DB username
  //  */
  // username: process.env.DB_USERNAME,

  // /**
  //  * DB password
  //  */
  // password: process.env.DB_PASSWORD,

  // /**
  //  * DB database
  //  */
  // database: process.env.DATABASE,

  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DB,
  password: process.env.DB_PASSWORD,
  /**
   * S3
   */
  s3AccessKey: process.env.S3_ACCESS_KEY as string,
  s3SecretKey: process.env.S3_SECRET_KEY as string,
  bucketName: process.env.BUCKET_NAME as string,
};
