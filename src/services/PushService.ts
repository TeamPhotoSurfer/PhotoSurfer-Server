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

const getPushDetail = async (client: any, userId: number, pushId: number) => {

  const { rows : push } = await client.query(
    `
      SELECT * 
      FROM push
      where push.is_deleted = false AND push.id = $1;
    `,
    [pushId],
  );
  console.log(push[0]);
  const photoId = push[0].photo_id;
  
  const { rows : tags } = await client.query(
    `
      SELECT photo_tag.tag_id, tag.name
      FROM photo_tag, tag
      where photo_tag.is_deleted = false 
      AND photo_tag.photo_id = $1 AND photo_tag.is_represent = true
      AND photo_tag.tag_id = tag.id;
    `,
    [photoId],
  );
  console.log(tags);
  const tagReturn = tags.map(x => {
    return {
      tagId : x.tag_id,
      tagName : x.name
    };
  });
  
  const data = {
    "pushId" : push[0].id,
    "pushDate" : dayjs(push[0].push_date).format("YYYY-MM-DD"),
    "tags" : tagReturn,
    "memo" : push[0].memo
  }
  return data;
}

export default {
  createPush,
  getPushDetail
}
