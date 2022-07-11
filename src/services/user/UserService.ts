import { getRepository } from "typeorm";
import { User } from "../../entity/user/User";
import {
  UserSearchRequest,
  NewCreateRequest,
} from "../../interfaces/user/UserCreateRequest";

const findUserByEmail = async (data: UserSearchRequest) => {
  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { email: data.email } });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createUser = async (newCreateRequest: NewCreateRequest) => {
  const userRepository = getRepository(User);
  try {
    const user = new User(
      newCreateRequest.name,
      newCreateRequest.email,
      newCreateRequest.socialType,
      newCreateRequest.fcmToken,
      newCreateRequest.push
    );
    console.log(user);

    await userRepository.save(user);
    
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export default { findUserByEmail, createUser };
