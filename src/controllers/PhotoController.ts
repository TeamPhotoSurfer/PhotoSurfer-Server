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
      imageUrl: location,
      tag,
    };
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, data));
  } catch (error) {
    console.log(error);
    if (error === 404) {
      return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
const findPhotoByTag = async (req: Request, res: Response) => {
  let client;
  // const userId = req.body.user.id;
  const userId = 1;
  const tagId = req.query.id as string;

  if (!tagId) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
  try {
    client = await db.connect(req);
    const photos = await photoService.findPhotoByTag(client, userId, tagId);
    const tags = await photoService.getTagsByIds(client, tagId, userId);
    const data = {
      tags,
      photos,
    };
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, data));
  } catch (error) {
    console.log(error);
    if (error === 404) {
      return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

const getPhoto = async (req: Request, res: Response) => {
  let client;
  // const userId = req.body.user.id;
  const userId = 1;
  const photoId: number = req.params.photoId as unknown as number;
  try {
    client = await db.connect(req);
    const photo = await photoService.getPhotoById(client, photoId, userId);

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, photo));
  } catch (error) {
    console.log(error);
    if (error === 404) {
      return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
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
    const tag = await photoService.addPhotoTag(client, userId, photoId, name, type);

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, tag));
  } catch (error) {
    console.log(error);
    if (error == 400) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
    }
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

const deletePhotoTag = async (req: Request, res: Response) => {
  let client;
  const tagId: number = req.params.tagId as unknown as number;
  const photoIds: number[] = req.body.photoIds;
  // const userId = req.body.user.id;
  const userId = 1;
  try {
    client = await db.connect(req);
    const tag = await photoService.deletedPhotoTag(client, userId, tagId, photoIds);

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, tag));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

const updatePhotoTag = async (req: Request, res: Response) => {
  let client;
  const tagId: number = req.params.tagId as unknown as number;

  // const userId = req.body.user.id;
  const userId = 1;
  const { name, tagType } = req.body;
  const photoIds: number[] = req.body.photoIds;

  try {
    client = await db.connect(req);

    const tag = await photoService.updatePhotoTag(client, userId, name, photoIds, tagId, tagType);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, tag));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

export default {
  createPhotoTag,
  updatePhotoTag,
  deletePhotoTag,
  addPhotoTag,
  getPhoto,
  findPhotoByTag,
};
