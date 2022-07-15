import express, { Request, Response } from 'express';
import { PushCreateRequest } from '../interfaces/push/request/PushCreateRequest';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import pushService from '../services/PushService';
const db = require('../loaders/db');

/**
 * @route POST /photo/push
 * @Desc Create push alarm
 * @Access public
 */
 const createPush = async (req: Request, res: Response) => {
  console.log("controller");
  const userId = 2; //TODO :  변경하기 (임시로 해둠)
  const {photoId} = req.params;
  const pushCreateRequest: PushCreateRequest = req.body;
  
  let client;
  try{
    client = await db.connect(req);
    const result = await pushService.createPush(client, userId, Number(photoId), pushCreateRequest);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS,result));

  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  }
}

export default {
  createPush,
};
