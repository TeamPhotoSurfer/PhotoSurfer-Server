import express, { Request, Response } from 'express';
import { TagnameUpdateRequest } from '../interfaces/tag/TagnameUpdateRequest';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import tagService from '../services/TagService';
const db = require('../loaders/db');

/**
 * @route GET /tag
 * @Desc Get tags
 * @Access public
 */
//태그 조회하기 ->  
const getTagNames = async (req: Request, res: Response) => {
  const userId = 1; //TODO :  변경하기 (임시로 해둠)
  
  let client;
  try{
    client = await db.connect(req);
    const result = await tagService.getTagNames(client, userId);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS,result));

  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } 
}

/**
 * @route PUT /tag/:tagId
 * @Desc Update tagName
 * @Access public
 */
const updateTagName = async (req: Request, res: Response) => {
  const userId = 1; //TODO :  변경하기 (임시로 해둠)
  
  let client;
  try{
    client = await db.connect(req);
    const tagId : number = req.params.tagId as unknown as number;
    const tagNameUpdateRequest: TagnameUpdateRequest = req.body;
    
    const result = await tagService.updateTagName(client, userId, tagId, tagNameUpdateRequest);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS,result));

  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } 
}

export default {
  getTagNames,
  updateTagName
};