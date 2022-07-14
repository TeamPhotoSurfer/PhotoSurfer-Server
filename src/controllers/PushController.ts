import express, { Request, Response } from 'express';
// import statusCode from '../modules/statusCode';
// import message from '../modules/responseMessage';
// import util from '../modules/util';
// import { validationResult } from 'express-validator';
// import { PushCreateRequest } from '../interfaces/push/request/PushCreateRequest';
// import connection from '../loaders/db';

import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';

// /**
//  * @route POST /photo/push
//  * @Desc Create push alarm
//  * @Access public
//  */
// const createPush = async (req: Request, res: Response) => {
//   const error = validationResult(req);
//   if (!error.isEmpty()) {
//     return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
//   }

//   const pushCreateRequest: PushCreateRequest = req.body;
//   console.log(pushCreateRequest);
//   try {
//     // const data = await PushService.createPush(pushCreateRequest);

//     res.status(statusCode.CREATED).send(util.success(statusCode.CREATED, message.CREATE_PUSH_SUCCESS));
//   } catch (error) {
//     console.log(error);
//     res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
//   }
// };
