import { Request, Response } from "express";
import statusCode from "../../modules/statusCode";
import util from "../../modules/util";
import message from "../../modules/responseMessage";
import UserService from "../../services/user/UserService";
import { LoginUserDTO } from "../../interfaces/user/UserCreateRequest";
const axios = require("axios");
const getToken = require("../../modules/jwtHandler");

/**
 *  @route POST /auth/user
 *  @desc Authorization user & get token(로그인)
 *  @access Private
 */
const getKakaoUser = async (req: Request, res: Response) => {
  const refreshToken = req.body.refreshToken;
  const loginUserDTO: LoginUserDTO = req.body;

  try {
    console.log(loginUserDTO.accessToken);
    const user = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${loginUserDTO.accessToken}`,
      },
    });
    const checkUser = await UserService.findUserByEmail({
      //email 은 고유의 값이므로 check를 할 때 email로 체크
      email: user.data.kakao_account.email,
    });
    const data = {
      name: user.data.kakao_account.name,
      email: user.data.kakao_account.email,
      socialType: loginUserDTO.socialType,
      fcmToken: loginUserDTO.fcmToken,
      push: loginUserDTO.push,
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
          accessToken: loginUserDTO.accessToken,
          refreshToken: refreshToken,
        },
      });
    }
    // DB에 존재하는 유저는 토큰 발급 후 전달
    const jwtToken = getToken(checkUser.id);
    return res.status(statusCode.OK).json({
      status: statusCode.OK,
      success: true,
      message: "유저 로그인 성공",
      data: {
        user: checkUser,
        token: jwtToken,
        accessToken: loginUserDTO.accessToken,
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
