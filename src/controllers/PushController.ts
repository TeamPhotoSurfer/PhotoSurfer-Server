import express, { Request, Response } from "express";
import statusCode from "../modules/statusCode";
import message from "../modules/responseMessage";
import util from "../modules/util";
import { validationResult } from "express-validator";
import { PushCreateRequest } from "../interfaces/push/request/PushCreateRequest";
import PushService from "../services/PushService";
const db = require("../loaders/db");

/**
 *  @route GET /push/last
 *  @desc READ Push
 *  @access Public
 */
//지난 푸시알림
const getLastPush = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  const userId = 1;

  let client;
  try {
    client = await db.connect(req);
    const data = await PushService.getLastPush(client, userId);
    if (!data) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.GET_LAST_PUSH, data));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 *  @route GET /push/come
 *  @desc READ Push
 *  @access Public
 */
// 다가오는 알림 조회
const getComePush = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  const userId = 1;

  let client;
  try {
    client = await db.connect(req);
    const data = await PushService.getComePush(client, userId);
    if (!data) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.GET_COME_PUSH, data));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 *  @route GET /push/today
 *  @desc READ Push
 *  @access Public
 */
// 임박한 목록 조회
const getTodayPush = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send(util.fail(statusCode.BAD_REQUEST, message.NULL_VALUE));
  }
  const userId = 1;

  let client;
  try {
    client = await db.connect(req);
    const data = await PushService.getTodayPush(client, userId);
    if (!data) {
      return res
        .status(statusCode.NOT_FOUND)
        .send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    res
      .status(statusCode.OK)
      .send(util.success(statusCode.OK, message.GET_TODAY_PUSH, data));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default { getComePush, getTodayPush, getLastPush, };