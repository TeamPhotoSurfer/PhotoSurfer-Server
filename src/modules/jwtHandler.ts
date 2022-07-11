import { Long } from "typeorm";
import { JwtPayloadInfo } from "../interfaces/common/JwtPayloadInfo";
import jwt from "jsonwebtoken";
import config from "../config";

const getToken = (userId: Long) => {
  const payload: JwtPayloadInfo = {
    user: {
      id: userId,
    },
  };
  const accessToken: string = jwt.sign(payload, config.jwtSecret, {
    expiresIn: "720h",
  });
  return accessToken;
};

export default getToken;
