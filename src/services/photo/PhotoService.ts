import { getConnection, getRepository } from 'typeorm';
import { PhotoPostDTO } from '../../DTO/photoDTO';
import { Photo } from '../../entity/photo/Photo';
import { Push } from '../../entity/push/Push';
import { PushTag } from '../../entity/pushtag/PushTag';
import { Tag } from '../../entity/tag/Tag';
import { User } from '../../entity/user/User';
import { PushCreateRequest } from '../../interfaces/push/request/PushCreateRequest';

const createPhoto = async (location: string, tags: PhotoPostDTO[]) => {
  const userRepository = getRepository(User);
  const photoRepository = getRepository(Photo);
  const tagRepository = getRepository(Tag);
  const pushRepository = getRepository(Push);

  try {
    await getConnection().createQueryBuilder().insert().into(Photo).values({ imageURL: location }).execute();
    const tag = tags.map(x => console.log(x.name));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createPhoto,
};
