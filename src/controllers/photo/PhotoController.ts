import message from '../../modules/responseMessage';
import express, { Request, Response } from 'express';
import statusCode from '../../modules/statusCode';
import util from '../../modules/util';
import { PhotoPostDTO } from '../../DTO/photoDTO';
import PhotoService from '../../services/photo/PhotoService';
// import FileService from '../services/FileService';

const uploadFileToS3 = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  const image: Express.MulterS3.File = req.file as Express.MulterS3.File;
  const { originalname, location } = image;
  const tags: PhotoPostDTO[] = req.body.tags;

  const tag: PhotoPostDTO[] = JSON.parse(JSON.stringify(tags));

  try {
    const data = await PhotoService.createPhoto(2, location, tag);

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, tags));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
};

export default {
  uploadFileToS3,
};
