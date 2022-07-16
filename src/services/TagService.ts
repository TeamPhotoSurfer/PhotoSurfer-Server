import { PushCreateRequest } from "../interfaces/push/request/PushCreateRequest";
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";
import { PhotoPostDTO, PhotoReturnDTO } from "../DTO/photoDTO";
import dayjs from "dayjs";
import { TagnameUpdateRequest } from "../interfaces/tag/TagnameUpdateRequest";

const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

const getTagNames = async (client: any, userId: number) => {
  const { rows : distinctTags } = await client.query(
    `
    SELECT DISTINCT ON (T.id) T.id, T.name, T.bookmark_status, T.image_url
    FROM (
      SELECT tag.id, tag.name, tag.bookmark_status, photo.image_url
      FROM tag, photo_tag, photo
      WHERE tag.user_id = $1 AND tag.is_deleted = false
      AND tag.id = photo_tag.tag_id AND photo_tag.is_deleted = false
      AND photo_tag.photo_id = photo.id AND photo.is_deleted = false
      ORDER BY tag.name
    ) T
    `,
    [userId]
  );

  var bookmarked = {
    "tags" : []
  };
  var notBookmarked = {
    "tags" : []
  };

  for(let i = 0; i < distinctTags.length ; i++){
    if(distinctTags[i].bookmark_status == true){
      bookmarked.tags.push(distinctTags[i]);
    }
    else{
      notBookmarked.tags.push(distinctTags[i]);
    }
  }
  
  const data = {
    bookmarked,
    notBookmarked
  };

  return data;
};

//수정하려고하는 태그가 이미 존재하는지 확인 (userId, tagName으로 검색) -> 존재하지 않으면 tag 새로 생성 , 태그가 이미 존재하면 해당 tagId 받아옴
//수정 전 태그가 마지막으로 남은 태그인지 확인 photo_tag에서 tag_id 갯수 세서 1개면 -> tag테이블에서 해당 tag is_deleted = true로 변경하기
//이미 해당 태그에 존재하는 사진들을 모두 다 새로 생성된 태그로 이동해야 함 -> photo_tag tag_id를 이전 tagId에서 -> 새로 생성한 태그id로 update하기

const updateTag = async (
  client: any,
  userId: number,
  tagId: number,
  tagNameUpdateRequest: TagnameUpdateRequest
) => {
  //수정하려고하는 태그가 이미 존재하는지 확인 (userId, tagName으로 검색) -> 존재하지 않으면 tag 새로 생성 , 태그가 이미 존재하면 해당 tagId 받아옴
  const { rows: checkExist } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE tag.user_id = $1 AND tag.name = $2
    AND tag.is_deleted = false
    `,
    [userId, tagNameUpdateRequest.name]
  );
  console.log(checkExist[0]);
  let newTagId = 0;
  if(checkExist.length >= 1){
    newTagId = checkExist[0].id;
  }
  else if (checkExist.length < 1) {
    //존재X -> 태그 새로 생성
    const { rows: original } = await client.query(
      `
      SELECT *
      FROM tag
      WHERE tag.id = $1
      AND tag.is_deleted = false
      `,
      [tagId]
    );
    
    const { rows: createPhotoTag } = await client.query(
      `
      INSERT INTO tag
      (name, tag_type, user_id)
      VALUES ($1, $2, $3);
      `,
      [tagNameUpdateRequest.name, original[0].tag_type, userId]
    );

    const { rows: newTag } = await client.query(
      `
      SELECT *
      FROM tag
      WHERE tag.name = $1 AND tag.user_id = $2
      AND tag.is_deleted = false
      `,
      [tagNameUpdateRequest.name, userId]
    );
    
    newTagId = newTag[0].id;
  }

  //수정 전 태그가 마지막으로 남은 태그인지 확인 photo_tag에서 tag_id 갯수 세서 1개면 -> tag테이블에서 해당 tag is_deleted = true로 변경하기
  const { rows: checkLastTag } = await client.query(
    `
    SELECT *
    FROM photo_tag
    where tag_id = $1 AND is_deleted = false
    `,
    [tagId]
  );

  if (checkLastTag.length == 1) {
    const { rows: updateLastTag } = await client.query(
      `
      UPDATE tag
      SET is_deleted = true
      WHERE tag_id = $1
      `,
      [checkLastTag[0].tag_id]
    );
  }

  //이미 해당 태그에 존재하는 사진들을 모두 다 새로 생성된 태그로 이동해야 함 -> photo_tag tag_id를 이전 tagId에서 -> 새로 생성한 태그id로 update하기
  if (tagId !== newTagId) {
    const { rows: updateAllTag } = await client.query(
      `
      UPDATE photo_tag
      SET tag_id = $1
      WHERE tag_id = $2
      `,
      [newTagId, tagId]
    );
    console.log(updateAllTag[0]);
  }
};

//태그명 삭제 
//photo_tag 테이블에서 해당 tag를 딱 하나 가지고 있던 photo가 존재하면 그 photo_id로 photo 삭제 
  //-> photo_id로 group by, count(tag_id) = 1 and count(*) = 1 , where is_delted = false 의 photo_id들 받아오기,
  //=> 해당 photo_id들 photo에서 is_deleted = true로 변경
//photo_tag 테이블에서 tagId로 해당하는 태그 is_deleted = true로 변경
//tag 테이블에서 userId, id 로 해당하는 태그 is_deleted = true로 변경
const deleteTag = async (
  client: any,
  userId: number,
  tagId: number
) => {
  const { rows: deletePhoto } = await client.query(
    `
    UPDATE photo
    SET is_deleted = true
    WHERE id IN (
      SELECT photo_id
      FROM photo_tag
      WHERE is_deleted = false AND tag_id = $1
      GROUP BY photo_id
      HAVING count(tag_id) = 1 AND count(*) = 1
    )
    `,
    [tagId]
  );
  const { rows: deletePhotoTag } = await client.query(
    `
    UPDATE photo_tag
    SET is_deleted = true
    WHERE tag_id = $1
    `,
    [tagId]
  );
  const { rows: deleteTag } = await client.query(
    `
    UPDATE tag
    SET is_deleted = true
    WHERE id = $1 AND user_id = $2
    `,
    [tagId, userId]
  );
}

//최근 추가한 태그 => tag테이블에서 user_id & tag_type=general 인거 고르고, order by updated_at desc, limit 6
//자주 추가한 태그 => tag테이블에서 user_id & tag_type=general 인거 고르고, order by add_count desc, limit 6
//플랫폼 유형 => 기본 제공 태그 3개 + tag 테이블에서 user_id & tag_type=platform 인거 고르고, order by add_count desc, limit 3
const getMainTags = async (client: any, userId: number) => {
  const GENERAL = "general";
  const PLATFORM = "platform";

  const { rows : recentTags } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE user_id = $1 AND tag_type = $2
    ORDER BY updated_at DESC
    LIMIT 6
    `,
    [userId, GENERAL]
  );
  const { rows : oftenTags } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE user_id = $1 AND tag_type = $2
    ORDER BY add_count DESC
    LIMIT 6
    `,
    [userId, GENERAL]
  );
  var platformTagArr = [{"id" : 0, "name" : "블로그"}, {"id" : 0, "name" : "카카오톡"}, {"id" : 0, "name" : "유튜브"}];
  //TODO : 블로그, 카카오톡, 유튜브 태그 넣어두고 이거 id 각각 변경하기
  const { rows : platformTags } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE user_id = $1 AND tag_type = $2
    ORDER BY add_count DESC
    LIMIT 3
    `,
    [userId, PLATFORM]
  );
  platformTags.map(x => platformTagArr.push({"id" : x.id, "name" : x.name}));

  const data = {
    "recent" : {
      "tags" : recentTags.map(x => {
        return {"id" : x.id, "name" : x.name}
      })
    },
    "often" : {
      "tags" : oftenTags.map(x => {
        return {"id" : x.id, "name" : x.name}
      })
    },
    "platform" : {
      "tags" : platformTagArr
    }
  };

  return data;
}

export default {
  getTagNames,
  updateTag,
  deleteTag,
  getMainTags
};
