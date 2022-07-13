import express, { Request, Response, NextFunction } from "express";
const app = express();
import connectDB from "./loaders/db";
import routes from "./routes";

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes); //라우터
// error handler

//push-alarm
// const admin = require('firebase-admin')
// let serviceAccount = require('../(서버 키 경로).json')

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

interface ErrorType {
  message: string;
  status: number;
}

app.use(function (
  err: ErrorType,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "production" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

app
  .listen(process.env.PORT, () => {
    console.log(`
    ################################################
          🛡️  Server listening on port 🛡️
    ################################################
  `);
  })
  .on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
