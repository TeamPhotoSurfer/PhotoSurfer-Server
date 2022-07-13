import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import util from "../modules/util";

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  // 토큰의 유무 검증
  if (!token) {
    return res
      .status(statusCode.UNAUTHORIZED)
      .send(util.fail(statusCode.UNAUTHORIZED, message.NULL_VALUE_TOKEN));
  }

  // 토큰 검증
  try {
    const decoded = jwt.verify(token, config.jwtSecret); // 검증

    req.body.user = (decoded as any).user;

    next();
  } catch (error) {
    console.log(error);
    if ((error as any).name == "TokenExpiredError") {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(util.fail(statusCode.UNAUTHORIZED, message.INVALID_TOKEN));
    }
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

