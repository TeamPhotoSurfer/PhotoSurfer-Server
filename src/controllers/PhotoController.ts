import express, { Request, Response } from "express";
import message from "../modules/responseMessage";
import statusCode from "../modules/statusCode";
import util from "../modules/util";
import PhotoService from "../services/PhotoService";
const db = require("../loaders/db");

/**
 *  @route PUT /photo/?id=12&id=23
 *  @desc Put Photo
 *  @access Public
 */

const deletePhoto = async (req: Request, res: Response) => {
  const photoId: number = req.query.id as unknown as number;
  let client;
  const userId = 10;

  try {
    client = await db.connect(req);

    await PhotoService.deletePhoto(client, photoId, userId);
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.DELETE_PHOTO_SUCCESS));
  } catch (error) {
    console.log(error);
    if(error == 400){
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.PHOTO_DELETE_ERROR));
    }
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }finally {
    client.release();
  }
};

export default {
  deletePhoto,
};
