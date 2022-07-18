import express, { Request, Response } from "express";
import statusCode from "../modules/statusCode";
import message from "../modules/responseMessage";
import util from "../modules/util";
import { validationResult } from "express-validator";
import TagService from "../services/TagService";
const db = require("../loaders/db");

/**
 *  @route PUT /tag/bookmark/:tagId
 *  @desc PUT Tag Bookmark
 *  @access Public
 */
const bookmarkAdd = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  let client;
  const userId = 1;
  const tagId: number = req.params.tagId as unknown as number;

  try {
    client = await db.connect(req);
    await TagService.bookmarkAdd(client, userId, tagId);

    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.UPDATE_BOOKMARK_SUCCESS));
  } catch (error) {
    console.log(error);
    if (error == 400) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, message.BOOKMARK_ADD_ERROR));
    }
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

/**
 *  @route DELETE /tag/bookmark/:tagId
 *  @desc DELETE Tag Bookmark
 *  @access Public
 */
const bookmarkDelete = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }

  let client;
  const userId = 1;
  const tagId: number = req.params.tagId as unknown as number;

  try {
    client = await db.connect(req);
    await TagService.bookmarkDelete(client, userId, tagId);

    return res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.DELETE_BOOKMARK_SUCCESS));
  } catch (error) {
    console.log(error);
    if (error == 400) {
      return res
        .status(statusCode.BAD_REQUEST)
        .send(util.fail(statusCode.BAD_REQUEST, message.BOOKMARK_DELETE_ERROR));
    }
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send(
        util.fail(
          statusCode.INTERNAL_SERVER_ERROR,
          message.INTERNAL_SERVER_ERROR
        )
      );
  }
};

export default {
  bookmarkAdd,
  bookmarkDelete,
};
