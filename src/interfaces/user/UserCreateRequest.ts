import { SocialType } from "../../entity/user/SocialType";

export interface UserSearchRequest {
  email: string;
}

export interface NewCreateRequest {
  name: string;
  email: string;
  socialType: SocialType;
  fcmToken: string;
  push: boolean;
}

export interface LoginUserDTO{
    accessToken: string;
    socialType: SocialType;
    fcmToken: string;
    push: boolean;
}
