import { Request, Response } from "express";
import { validationResult } from "express-validator";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import PushService from "../services/PushService";
const db = require("../loaders/db");

/**
<<<<<<< HEAD
 *  @route GET /push/come
 *  @desc READ Push
 *  @access Public
 */
// 다가오는 알림 조회
const getComePush = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  const userId = 1;

  let client;
  try {
    client = await db.connect(req);
    const data = await PushService.getComePush(client, userId);
    if (!data) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.GET_COME_PUSH, data));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { getComePush };
