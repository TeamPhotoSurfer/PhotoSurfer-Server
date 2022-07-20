import { Request, Response } from 'express';
import statusCode from '../modules/statusCode';
import util from '../modules/util';
import message from '../modules/responseMessage';
import AuthService from '../services/AuthService';
const db = require('../loaders/db');
const axios = require('axios');
// const jwtHandler = require("../modules/jwtHandler");
import jwtHandler from '../modules/jwtHandler';

/**
 *  @route POST /auth/user
 *  @desc Authorization user & get token(카카오로그인)
 *  @access Private
 */
const getKakaoUser = async (req: Request, res: Response) => {
  const { socialToken, socialType, fcm } = req.body;

  let client;

  try {
    client = await db.connect(req);
    const user = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: {
        Authorization: `Bearer ${socialToken}`,
      },
    });
    //email 은 고유의 값이므로 check를 할 때 email로 체크
    const email = user.data.kakao_account.email;
    const checkUser = await AuthService.findUserByEmail(client, email, socialType);
    const data = {
      name: user.data.kakao_account.name,
      email,
      socialType: socialType,
      fcmToken: fcm,
    };
    if (!checkUser) {
      //DB에 없는 유저 새로 생성 후 토큰 발급
      const newUser = await AuthService.createUser(client, data);
      const jwtToken = jwtHandler.getToken(newUser.id);
      return res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, { newUser, accesstoken: jwtToken }));
    }
    // DB에 존재하는 유저는 토큰 발급 후 전달
    //fcm이 갱신됐다면 변경
    const checkFcm = checkUser.fcmToken;
    if (checkFcm !== fcm) {
      const newFcm = await AuthService.updateFcm(client, fcm, checkUser.id);
      checkUser.fcmToken = newFcm.fcmToken;
    }
    const jwtToken = jwtHandler.getToken(checkUser.id);

    return res.status(statusCode.OK).send(util.success(statusCode.OK, message.SUCCESS, { checkUser, accesstoken: jwtToken }));
  } catch (error) {
    console.log(error);
    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

export default {
  getKakaoUser,
};
