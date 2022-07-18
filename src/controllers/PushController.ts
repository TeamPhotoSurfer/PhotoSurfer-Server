import express, { Request, Response } from 'express';
import { PushCreateRequest } from '../interfaces/push/request/PushCreateRequest';
import message from '../modules/responseMessage';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import pushService from '../services/PushService';
const db = require('../loaders/db');
const admin = require('firebase-admin');
const pm = require('../modules/pushMessage');
const pushAlarm = require('../modules/pushAlarm');
import dayjs from 'dayjs';

/**
 * @route POST /push
 * @Desc Create push alarm
 * @Access public
 */
 const createPush = async (req: Request, res: Response) => {
  const userId = 2; //TODO :  변경하기 (임시로 해둠)
  const photoId : number = req.params.photoId as unknown as number;

  const pushCreateRequest: PushCreateRequest = req.body;
  
  console.log(photoId);
  
  let client;
  try{
    client = await db.connect(req);
    const result = await pushService.createPush(client, userId, photoId, pushCreateRequest);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS,result));

  } catch (error) {
    console.log(error);
    if(error == 403){
      res.status(statusCode.FORBIDDEN).send(util.fail(statusCode.FORBIDDEN, message.PUSH_DATE_ERROR));
    }
    else if(error == 404){
      res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    else if(error == 400){
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, message.PUSH_TAG_ERROR));
    }
    else{
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
    }
  }
}

/**
 * @route GET /push
 * @Desc Get push detail
 * @Access public
 */
const getPushDetail = async (req: Request, res: Response) => {
  const userId = 2; //TODO :  변경하기 (임시로 해둠)
  const pushId : number = req.params.pushId as unknown as number;
  
  let client;
  try{
    client = await db.connect(req);
    const result = await pushService.getPushDetail(client, userId, pushId);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS,result));

  } catch (error) {
    console.log(error);
    if(error == 404){
      res.status(statusCode.NOT_FOUND).send(util.fail(statusCode.NOT_FOUND, message.NOT_FOUND));
    }
    else{
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
    }
  } 
}

//푸시알림 테스트
const pushTest = async (req: Request, res: Response) => {
  //디바이스의 토큰 값
  let target_token = [`fngkHv04WEBem5K0SvxQLt:APA91bHSjh67rJqT_L3sr8eDNWcTed0NB-Dl59sPEC3ZzGKI8dJtosBfx2s07aTRJRk7rLCe85XUZI0uWrUXdQg53B-ivU7GC56ZlEUYgsIEAc50X5s3U4pEEg4d0TnHFXm_YG08sLWj`,]
	
  pushAlarm.sendPushAlarm(pm.push9title, pm.push9Desc, 'https://foo.bar.pizza-monster.png', target_token);
}

const pushPlan = async (req: Request, res: Response) => {
  let client;
  try {
    client = await db.connect(req);

    const date1 = new Date();
    date1.setDate(date1.getDate());
    date1.setHours(0,0,0,0);
    
    const date2 = new Date();
    date2.setDate(date2.getDate() + 1);
    date2.setHours(0,0,0,0);

    const plan = await pushService.pushPlan(client, date1, date2);
    console.log(plan);
    
    let token = plan.map(a => a.fcm_token);
    token = token.filter(function (item) {
      return item !== null && item !== undefined && item !== '';
    });
    
    plan.map(x => {
      pushAlarm.sendPushAlarm('서퍼님, 잊지마세요!', pm.push9Desc, 'https://foo.bar.pizza-monster.png', testToken);
    })
    const testToken = [`fngkHv04WEBem5K0SvxQLt:APA91bHSjh67rJqT_L3sr8eDNWcTed0NB-Dl59sPEC3ZzGKI8dJtosBfx2s07aTRJRk7rLCe85XUZI0uWrUXdQg53B-ivU7GC56ZlEUYgsIEAc50X5s3U4pEEg4d0TnHFXm_YG08sLWj`,]    
    pushAlarm.sendPushAlarm(pm.push9title, pm.push9Desc, 'https://foo.bar.pizza-monster.png', testToken);
    res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, plan));

  } catch (error) {
    console.log(error);
  } finally {
    client.release();
  }
};

export default {
  createPush,
  getPushDetail,
  pushTest,
  pushPlan
};
