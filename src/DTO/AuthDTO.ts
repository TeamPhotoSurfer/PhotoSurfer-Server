export interface userSearchInput {
  id?: number;
  email?: string;
}

export interface IUserInputDTO {
  name: String;
  email: String;
}

export interface userInputDTO {
  name: String;
  email: String;
  socialType?: string;
  fcmToken?: string;
  push?: boolean;
}