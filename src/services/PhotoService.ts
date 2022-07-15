import { PushCreateRequest } from "../interfaces/push/request/PushCreateRequest";
import dayjs from 'dayjs';

const convertSnakeToCamel3 = require("../modules/convertSnakeToCamel");

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

export default {
  createPush
};
