import { Request, Response } from "express";
import QueryString from "qs";
import config from "../../config";
import statusCode from "../../modules/statusCode";
import util from "../../modules/util";
import message from "../../modules/responseMessage";
import UserService from "../../services/user/UserService";
import { User } from "../../entity/user/User";
import { SocialType } from "../../entity/user/SocialType";
import { stringify } from "querystring";
const axios = require("axios");
const getToken = require("../../modules/jwtHandler");

/**
 *  @route POST /auth/user
 *  @desc Authorization user & get token(로그인)
 *  @access Private
 */
const getKakaoUser = async (req: Request, res: Response) => {
  let accessToken = req.body.accessToken;
  const refreshToken = req.body.refreshToken;

  try {
    const newToken = await axios({
      method: "POST",
      url: "https://kauth.kakao.com/oauth/token",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      data: QueryString.stringify({
        grant_type: "refresh_token",
        client_id: config.CLIENT_ID,
        refreshToken: refreshToken,
      }),
    });

    if (newToken.status != 200) {
      return res
        .status(statusCode.UNAUTHORIZED)
        .send(util.fail(statusCode.UNAUTHORIZED, message.INVALID_TOKEN));
    }
    accessToken = newToken.data.accessToken;
    const user = await axios({
      method: "GET",
      url: "https://kapi.kakao.com/v2/user/me",
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const checkUser = await UserService.findUserByEmail({ //email 은 고유의 값이므로 check를 할 때 email로 체크
      email: user.data.kakao_account.email,
    });
    const data = {
      name: user.data.kakao_account.name,
      email: user.data.kakao_account.email,
      socialType: SocialType,
      fcmToken: String,
      push: Boolean,
    };
    if (!checkUser) {
      //DB에 없는 유저 새로 생성 후 토큰 발급
      const newUser = await UserService.createUser(data);
      const jwtToken = getToken(newUser.id);
      return res.status(statusCode.OK).json({
        status: statusCode.OK,
        success: true,
        message: "유저 생성 성공",
        data: {
          user: newUser,
          token: jwtToken,
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      });
    }
    //DB에 존재하는 유저는 토큰 발급 후 전달
    const jwtToken = getToken(checkUser.id);
    return res.status(statusCode.OK).json({
      status: statusCode.OK,
      success: true,
      message: "유저 로그인 성공",
      data: {
        user: checkUser,
        token: jwtToken,
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    });
  } catch (error) {
    console.log(error);
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

export default { getKakaoUser };
