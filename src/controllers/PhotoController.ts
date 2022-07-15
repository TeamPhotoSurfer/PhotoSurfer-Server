import express, { Request, Response } from "express";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import photoService from "../services/PhotoService";
const db = require("../loaders/db");

const test = async (req: Request, res: Response) => {
  let client;
  try {
    client = await db.connect(req);
    const likeResult = await photoService.test(client);
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.SUCCESS));
  } catch (error) {
    console.log(error);
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  } finally {
    client.release();
  }
};

export default {
  test,
};
