import { JwtPayloadInfo } from "../interfaces/common/JwtPayloadInfo";
import jwt from "jsonwebtoken";
import config from "../config";

const getToken = (userId: string) => {
  const payload: JwtPayloadInfo = {
    user: {
      id: userId,
    },
  };
  const socialToken: string = jwt.sign(payload, config.jwtSecret, {
    expiresIn: "720h",
  });
  return socialToken;
};

// module.exports = { getToken };
export default { getToken };
