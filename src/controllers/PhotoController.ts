import express, { Request, Response } from 'express';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import photoService from '../services/PhotoService';
const db = require('../loaders/db');

const test = async (req: Request, res: Response) => {
  let client;
  try {
    client = await db.connect(req);
    const likeResult = await photoService.test(client);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

export default {
  test,
};

// const createPhotoTag = async (req: Request, res: Response) => {
//   if (!req.file) {
//     return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
//   }
//   const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
//   const { originalname, location } = image;
//   const tags: PhotoPostDTO[] = req.body.tags;

//   const tag: PhotoPostDTO[] = JSON.parse(JSON.stringify(tags));

//   try {
//     const data = await PhotoService.createPhotoTag(2, location, tag);

//     res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, tags));
//   } catch (error) {
//     console.log(error);
//     res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
//   }
// };

// export default {
//   createPhotoTag,
// };
