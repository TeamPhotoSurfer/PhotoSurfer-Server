import message from '../../modules/responseMessage';
import express, { Request, Response } from 'express';
import statusCode from '../../modules/statusCode';
import util from '../../modules/util';
import { PhotoPostDTO } from '../../DTO/photoDTO';
import PhotoService from '../../services/photo/PhotoService';
// import FileService from '../services/FileService';

const createPhotoTag = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
  const { originalname, location } = image;
  let tags: PhotoPostDTO[] = JSON.parse(JSON.stringify(req.body.tags));
  try {
    const photo = await PhotoService.createPhotoTag(2, location, tags);

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, photo));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

const findPhotoById = async (req: Request, res: Response) => {
  const { tagId } = req.query;

  console.log(tagId);
  try {
    // const data = await PhotoService.createPhotoTag();

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};
export default {
  createPhotoTag,
  findPhotoById,
};
