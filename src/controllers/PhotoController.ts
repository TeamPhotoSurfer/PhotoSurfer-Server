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
  const userId = req.body.user.id;
  const tag = req.body.tags;
  console.log(tag);
  if (!tag) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
  }
  let tags: PhotoPostDTO[] = JSON.parse(JSON.stringify(tag));
  console.log(tags);
  try {
    client = await db.connect(req);
    const photo = await photoService.createPhotoTag(client, userId, location, tags);
    console.log(photo);
    const tag = await photoService.getTagByPhotoId(client, photo, userId);
    const data = {
      id: photo,
      imageUrl: location,
      tags: tag,
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
  const userId = req.body.user.id;
  const tagId = req.query.id as string;

  if (!tagId || !userId) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
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
  const userId = req.body.user.id;
  const photoId: number = req.params.photoId as unknown as number;
  if (!photoId || !userId) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
  }
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
  const userId = req.body.user.id;
  const { name, type, photoId } = req.body;
  console.log(photoId);
  if (!photoId || !userId || !name || !type) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
  }
  try {
    client = await db.connect(req);
    const tag = await photoService.addPhotoTag(client, userId, photoId, name, type);

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, tag));
  } catch (error) {
    console.log(error);
    if (error === 400) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.ALREADY_EXIST_TAG));
    } else if (error === 404) {
      return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
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
  const userId = req.body.user.id;

  if (!photoIds || !userId || !tagId) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
  }
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
  const userId = req.body.user.id;
  const { name, tagType } = req.body;
  const photoIds: number[] = req.body.photoIds;

  if (!tagId || !userId || !name || !tagType || !photoIds) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
  }
  try {
    client = await db.connect(req);

    const tag = await photoService.updatePhotoTag(client, userId, name, photoIds, tagId, tagType);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, tag));
  } catch (error) {
    console.log(error);
    if (error == 400) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NOT_EXIST_TAG));
    }
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};
const getTag = async (req: Request, res: Response) => {
  let client;
  const userId = req.body.user.id;
  if (!userId) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
  }
  try {
    client = await db.connect(req);

    const tag = await photoService.getTag(client, userId);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, tag));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

/**
 *  @route PUT /photo/?id=12&id=23
 *  @desc Put Photo
 *  @access Public
 */

const deletePhoto = async (req: Request, res: Response) => {
  const photoId: number = req.query.id as unknown as number;
  let client;
  const userId = req.body.user.id;

  if (!photoId || !userId) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST));
  }
  try {
    client = await db.connect(req);

    await photoService.deletePhoto(client, photoId, userId);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.DELETE_PHOTO_SUCCESS));
  } catch (error) {
    console.log(error);
    if (error == 400) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.PHOTO_DELETE_ERROR));
    }
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
  getTag,
  deletePhoto,
};
