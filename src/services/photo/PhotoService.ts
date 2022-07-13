import { getConnection, getRepository, InsertValuesMissingError, SimpleConsoleLogger } from 'typeorm';
import { PhotoPostDTO, PhotoPostResponseDTO } from '../../DTO/photoDTO';
import { Photo } from '../../entity/photo/Photo';
import { Push } from '../../entity/push/Push';
import { PushTag } from '../../entity/pushtag/PushTag';
import { PhotoTag } from '../../entity/phototag/PhotoTag';
import { Tag } from '../../entity/tag/Tag';
import { User } from '../../entity/user/User';
import { PushCreateRequest } from '../../interfaces/push/request/PushCreateRequest';
import { TagType } from '../../entity/tag/TagType';
import { long } from 'aws-sdk/clients/cloudfront';
import e from 'express';

const createPhotoTag = async (userId: number, location: string, tags: PhotoPostDTO[]): Promise<PhotoPostResponseDTO> => {
  const tagRepository = getRepository(Tag);

  try {
    const photo = await getConnection().createQueryBuilder().insert().into(Photo).values({ userId: userId, imageURL: location }).execute();
    const photoId = photo.identifiers[0].id;

    let tagId: long;
    tags.map(async x => {
      const checkedTag = await tagRepository.findOne({
        name: x.name,
        userId: userId,
      });
      console.log(checkedTag);
      if (!checkedTag) {
        x.userId = userId;
        const result = await getConnection().createQueryBuilder().insert().into(Tag).values(x).execute();
        tagId = result.identifiers[0].id;
      } else {
        tagId = checkedTag.id as unknown as long;
        const count: number = checkedTag.addCount as unknown as number;
        tagRepository.update(tagId, {
          addCount: +count + 1,
        });
      }

      // if (checkedTag) {
      //   tagId = checkedTag.id as unknown as long;
      //   const count: number = checkedTag.addCount as unknown as number;
      //   tagRepository.update(tagId, {
      //     addCount: +count + 1,
      //   });
      // } else {
      //   x.userId = userId;
      //   const result = await getConnection().createQueryBuilder().insert().into(Tag).values(x).execute();
      //   tagId = result.identifiers[0].id;
      // }

      const data = {
        tagId,
        photoId,
      };
      await getConnection().createQueryBuilder().insert().into(PhotoTag).values(data).execute();
    });

    const result = {
      id: photoId,
      imageURL: location,
    };
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default {
  createPhotoTag,
};
