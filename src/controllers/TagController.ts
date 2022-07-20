import express, { Request, Response } from 'express';
import { TagnameUpdateRequest } from '../interfaces/tag/TagnameUpdateRequest';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import tagService from '../services/TagService';
import { validationResult } from 'express-validator';
import TagService from '../services/TagService';
const db = require('../loaders/db');

/**
 * @route GET /tag
 * @Desc Get tags
 * @Access public
 */
//태그 조회하기 ->
const getTagNames = async (req: Request, res: Response) => {
  const userId = req.body.user.id;

  let client;
  try {
    client = await db.connect(req);
    const result = await tagService.getTagNames(client, userId);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, result));
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

/**
 * @route PUT /tag/:tagId
 * @Desc Update tag
 * @Access public
 */
const updateTag = async (req: Request, res: Response) => {
  const userId = req.body.user.id;

  let client;
  try {
    client = await db.connect(req);
    const tagId: number = req.params.tagId as unknown as number;
    const tagNameUpdateRequest: TagnameUpdateRequest = req.body;

    const result = await tagService.updateTag(client, userId, tagId, tagNameUpdateRequest);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, result));
  } catch (error) {
    console.log(error);
    if (error == 400) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BAD_REQUEST_UPDATE_TAG));
    } else if (error == 404) {
      return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    } else {
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
    }
  } finally {
    client.release();
  }
};

/**
 * @route DELETE /tag/:tagId
 * @Desc Delete tag
 * @Access public
 */
const deleteTag = async (req: Request, res: Response) => {
  const userId = req.body.user.id;

  let client;
  try {
    client = await db.connect(req);
    const tagId: number = req.params.tagId as unknown as number;

    const result = await tagService.deleteTag(client, userId, tagId);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, result));
  } catch (error) {
    console.log(error);
    if(error == 404){
      return res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    else{
      return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
    }
  } finally {
    client.release();
  }
};

/**
 * @route GET /tag/main
 * @Desc Get tag main
 * @Access public
 */
const getMainTags = async (req: Request, res: Response) => {
  const userId = req.body.user.id;

  let client;
  try {
    client = await db.connect(req);
    const result = await tagService.getMainTags(client, userId);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS_GET_MAIN_TAG, result));
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.ERROR_GET_MAIN_TAG));
  } finally {
    client.release();
  }
};

/**
 * @route GET /tag/search
 * @Desc Get often search Tag
 * @Access public
 */
const getOftenSearchTags = async (req: Request, res: Response) => {
  const userId = req.body.user.id;
  console.log(userId);
  
  let client;
  try {
    client = await db.connect(req);
    const result = await tagService.getOftenSearchTags(client, userId);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS_GET_OFTEN_TAG, result));
  } catch (error) {
    console.log(error);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.ERROR_GET_OFTEN_TAG));
  } finally {
    client.release();
  }
};

/**
 *  @route PUT /tag/bookmark/:tagId
 *  @desc PUT Tag Bookmark
 *  @access Public
 */
const addBookmark = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  let client;
  const userId = req.body.user.id;
  const tagId: number = req.params.tagId as unknown as number;

  try {
    client = await db.connect(req);
    await TagService.addBookmark(client, userId, tagId);

    res.status(statusCode.OK).send(util.success(statusCode.OK, message.UPDATE_BOOKMARK_SUCCESS));
  } catch (error) {
    console.log(error);
    if (error == 400) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BOOKMARK_ADD_ERROR));
    }
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

/**
 *  @route DELETE /tag/bookmark/:tagId
 *  @desc DELETE Tag Bookmark
 *  @access Public
 */
const deleteBookmark = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  let client;
  const userId = req.body.user.id;
  const tagId: number = req.params.tagId as unknown as number;

  try {
    client = await db.connect(req);
    await TagService.deleteBookmark(client, userId, tagId);

    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.DELETE_BOOKMARK_SUCCESS));
  } catch (error) {
    console.log(error);
    if (error == 400) {
      return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.BOOKMARK_DELETE_ERROR));
    }
    else{
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
    }
  } finally {
    client.release();
  }
};

export default {
  getTagNames,
  updateTag,
  deleteTag,
  getMainTags,
  getOftenSearchTags,
  addBookmark,
  deleteBookmark,
};
