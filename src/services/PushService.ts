import { PushCreateRequest } from "../interfaces/push/request/PushCreateRequest";
import dayjs from 'dayjs';
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";


const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const createPush = async (client: any, userId: number, photoId: number, pushCreateRequest: PushCreateRequest) => {
  //====에러처리
  //오늘 날짜보다 이후인지 에러처리
  const date2 = new Date();
  date2.setDate(date2.getDate());
  date2.setHours(0,0,0,0);
  
  if(dayjs(pushCreateRequest.pushDate) <= dayjs(date2)){
    throw 403;
  }
  
  //사진 존재하는지 에러처리
  const { rows : checkPhotoExist } = await client.query(
    `
      SELECT count(*)
      FROM photo
      WHERE id = $1 AND user_id = $2 AND is_deleted = false
    `,
    [photoId, userId],
  );
    
  if(checkPhotoExist[0].count as number <= 0){
    throw 404;
  }

  //대표 태그는 무조건 1개~3개로
  if(!(1<=pushCreateRequest.tagIds.length && pushCreateRequest.tagIds.length<=3)){
    throw 400;
  }
  //====에러처리 끝
  
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
  if(!push[0]){
    throw 404;
  }
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

//push테이블에서 오늘 날짜인거 받아와서 -> user_id로 user에서 fcm토큰 받아오기
//photo_id로 photo_tag에서 tag_id, is_represent 받아오기 => tag_id로 tag name 받아오기
    //(대표태그 3개, 대표태그 없으면 일반 중에 orderby 해서 고르기)
//photo_id로 photo에서 image_url 받아오기
//
const pushPlan = async (client, date1, date2) => {
  const { rows : tokenAndImage } = await client.query(
          ` 
          SELECT u.fcm_token, photo.id, photo.image_url, push.id as pushId
          FROM push, "user" u, photo
          WHERE $1 <= push.push_date AND push.push_date < $2 AND push.is_deleted = false
          AND push.user_id = u.id AND photo.user_id = u.id 
          AND push.photo_id = photo.id AND photo.is_deleted = false
          `,
    [date1,date2],
  );
  //console.log(tokenAndImage);
  const photoIds = tokenAndImage.map(x => x.id);
  
  //오늘에 해당하는 많은 알림들이 존재할텐데, (한 user에도 많은 photo들이 존재하기 때문) -> 모든 photo의 id들을 받아와서 거기에 딸린 태그들을 받아오기
  const { rows : tags } = await client.query(
    `
          SELECT photo_tag.photo_id, tag.name
          FROM photo_tag, tag
          WHERE photo_tag.photo_id IN (${photoIds}) AND photo_tag.is_represent = true
          AND photo_tag.is_deleted = false
          AND photo_tag.tag_id = tag.id AND tag.is_deleted = false
          `,
  );
  //console.log(tags);
  //이 태그들 중에서 is_represent가 true인거 넣기
  
  const tagMap = new Map<number, Array<string>>();
  tags.map(x => {
    if(typeof tagMap.get(x.photo_id) ==='undefined'){
      var arr = [];
      arr.push(x.name);
      tagMap.set(x.photo_id, arr);
    }
    else{
      var arr : any[] = tagMap.get(x.photo_id);
      arr.push(x.name);
      tagMap.set(x.photo_id, arr);
    }
  })
  //console.log(tagMap);
  
  const data = tokenAndImage.map(x => {
    return {
      "push_id" : x.pushid,
      "fcm_token" : x.fcm_token,
      "photo_id" : x.id,
      "photo_tag" : tagMap.get(x.id)
    }
  })

  return data;
};

export default {
  createPush,
  getPushDetail,
  pushPlan
}
