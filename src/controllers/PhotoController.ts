import express, { Request, Response } from 'express';
import { PhotoPostDTO } from '../DTO/photoDTO';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import photoService from '../services/PhotoService';
const db = require('../loaders/db');

const createPhotoTag = async (req: Request, res: Response) => {
  let client;
  if (!req.file) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
  const { originalname, location } = image;
  // const userId = req.body.user.id;
  const userId = 1;
  let tags: PhotoPostDTO[] = JSON.parse(JSON.stringify(req.body.tags));
  try {
    client = await db.connect(req);
    const photo = await photoService.createPhotoTag(client, userId, location, tags);
    const tag = await photoService.getTagByPhotoId(client, photo, userId);
    const data = {
      id: photo,
      imageURL: location,
      tag,
    };
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, data));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const addPhotoTag = async (req: Request, res: Response) => {
  let client;
  // const userId = req.body.user.id;
  const userId = 1;
  const photoId = req.query.id as string;
  const { name, type } = req.body;
  try {
    client = await db.connect(req);
    const photo = await photoService.addPhotoTag(client, userId, photoId, name, type);

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS));
  } catch (error) {
    console.log(error);
    if (error == 400) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
    }
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  createPhotoTag,
  addPhotoTag,
};
