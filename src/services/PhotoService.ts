import { PushCreateRequest } from "../interfaces/push/request/PushCreateRequest";
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { PhotoPostDTO, PhotoReturnDTO } from '../DTO/photoDTO';
import dayjs from 'dayjs';

const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const createPush = async (client: any, userId: number, photoId: number, pushCreateRequest: PushCreateRequest) => {

  const { rows : push } = await client.query(
    `
      INSERT INTO push (memo, push_date, user_id, photo_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `,
    [pushCreateRequest.memo, new Date(pushCreateRequest.pushDate), userId, photoId],
  );
  console.log(push);
  

  for(let i of pushCreateRequest.tagIds){
    const { rows : tags} = await client.query(
      `
      UPDATE photo_tag SET is_represent = true
      WHERE tag_id = $1;
      `,
      [i],
    );
  }
  
  const data = {
    pushDate : dayjs(push[0].push_date).format("YYYY-MM-DD"),
    tagIds : pushCreateRequest.tagIds,
    memo : push[0].memo
  };

  return data;
}

const createPhotoTag = async (client: any, userId: number, imageURL: string, tags: PhotoPostDTO[]) => {
  const { rows } = await client.query(
    `
    INSERT INTO photo (user_id, image_url)
    VALUES ($1, $2)
    RETURNING *
    `,
    [userId, imageURL],
  );
  const photoId: number = rows[0].id;
  let tagId: number;
  for (let r of tags) {
    const { rows: checkedTag } = await client.query(
      `
        SELECT *
        FROM tag
        WHERE name = $1 AND user_id = $2 AND is_deleted = false
        `,
      [r.name, userId],
    );
    if (checkedTag[0]) {
      tagId = checkedTag[0].id;
    } else {
      const { rows: newTag } = await client.query(
        `
        INSERT INTO tag(name, tag_type, user_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [r.name, r.tagType, userId],
      );
      tagId = newTag[0].id;
    }
    const { rows } = await client.query(
      `
      INSERT INTO photo_tag (tag_id, photo_id)
      VALUES ($1, $2)
      RETURNING *
      `,
      [tagId, photoId],
    );
  }
  return convertSnakeToCamel.keysToCamel(photoId);
};

const getTagByPhotoId = async (client: any, photoId: number, userId: number) => {
  const { rows } = await client.query(
    `
    SELECT tag.id, tag.name, tag.tag_type
    FROM photo_tag, tag
    WHERE photo_tag.photo_id = $1 AND photo_tag.tag_id = tag.id AND tag.user_id = $2 
    AND photo_tag.is_deleted = false AND tag.is_deleted = false
    `,
    [photoId, userId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

export default {
  createPush,
  createPhotoTag,
  getTagByPhotoId,
}
