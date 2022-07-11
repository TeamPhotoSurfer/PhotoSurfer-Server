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
   * DB host
   */
  host: process.env.DB_HOST,

  /**
   * DB port
   */
  dbPort: parseInt(process.env.DB_PORT as string, 10) as number,

  /**
   * DB username
   */
  username: process.env.DB_USERNAME,

  /**
   * DB password
   */
  password: process.env.DB_PASSWORD,

  /**
   * DB database
   */
  database: process.env.DATABASE,

  /**
   * jwt Secret
   */
  jwtSecret: process.env.JWT_SECRET as string,

  /**
   * jwt Algorithm
   */
  jwtAlgo: process.env.JWT_ALGO as string,

  // //카카오 로그인 클라 필요
  // CLIENT_ID: process.env.CLIENT_ID,
  // CLIENT_SECRET: process.env.CLIENT_SECRET,
  // REDIRECT_URI: process.env.REDIRECT_URI,
};
