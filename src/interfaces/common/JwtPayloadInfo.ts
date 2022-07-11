import { Long } from "typeorm";

export interface JwtPayloadInfo {
  user: {
    id: Long;
  };
}
