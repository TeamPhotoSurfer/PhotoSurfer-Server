import { PushCreateRequest } from "../interfaces/push/request/PushCreateRequest";
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";
import { PhotoPostDTO, PhotoReturnDTO } from "../DTO/photoDTO";
import dayjs from "dayjs";
import { TagnameUpdateRequest } from "../interfaces/tag/TagnameUpdateRequest";

const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

const getTagNames = async (client: any, userId: number) => {
  const { rows : distinctTags } = await client.query(
    `
    SELECT DISTINCT ON (T.id) T.id, T.name, T.bookmark_status, T.image_url, T.tag_type
    FROM (
      SELECT tag.id, tag.name, tag.bookmark_status, photo.image_url, tag.tag_type
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
//tag테이블에서 수정전 original tag is_deleted = true로 변경하기
//이미 해당 태그에 존재하는 사진들을 모두 다 새로 생성된 태그로 이동해야 함 -> photo_tag tag_id를 이전 tagId에서 -> 새로 생성한 태그id로 update하기

const updateTag = async (
  client: any,
  userId: number,
  tagId: number,
  tagNameUpdateRequest: TagnameUpdateRequest
) => {
  //플랫폼태그인지 확인 후 에러처리
  const { rows: original } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE tag.id = $1
    AND tag.is_deleted = false
    `,
    [tagId]
  );
  if(!original[0]){
    throw 404;
  }
  if(original[0].tag_type != 'general'){
    throw 400;
  }
  //수정하려고하는 태그가 이미 존재하는지 확인 (userId, tagName으로 검색) -> 존재하지 않으면 tag 새로 생성 , 태그가 이미 존재하면 해당 tagId 받아옴
  //수정하려고 하는 태그가 이미 존재하는 경우, 대표태그 성격을 따라가기 / 수정하려고 하는 태그가 존재하지 않으면 대표태그는 false
  var new_is_represent: boolean = false;

  const { rows: checkExist } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE tag.user_id = $1 AND tag.name = $2
    `,
    [userId, tagNameUpdateRequest.name]
  );
  console.log(checkExist);
  
  let newTagId = 0;
  if(checkExist.length >= 1){
    newTagId = checkExist[0].id;
    if(checkExist[0].is_deleted){ //이미 지워진 태그였으면 is_deleted = false로(살리기) / 있는 태그면 그대로 / 존재하지 않은 태그면 새로 생성하기
      const { rows: updateExistTag } = await client.query(
        `
        UPDATE tag
        SET is_deleted = false
        WHERE tag_id = $1
        `,
        [checkExist[0].tag_id]
      );
    }
  }
  
  if (checkExist.length < 1) { //없으면 새로 생성
    //존재X -> 태그 새로 생성 
    
    const { rows: createPhotoTag } = await client.query(
      `
      INSERT INTO tag
      (name, tag_type, user_id)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [tagNameUpdateRequest.name, "general", userId] //무조건 일반태그만 수정 가능
    );
    
    newTagId = createPhotoTag[0].id;
    console.log(newTagId);
  }

  //수정 전 태그 Tag테이블에서 is_deleted = true로 변경하기 (태그 앨범에서는 한번에 다 변경되기 때문에 갯수를 체크할 필요 없음)
  const { rows: updateLastTag } = await client.query(
    `
    UPDATE tag
    SET is_deleted = true
    WHERE id = $1
    `,
    [tagId]
  );

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

  //중복 데이터 처리
  //다 바꾸고 중복이면 하나 날리고, is_represent가 true인 것만 남기기
  //리스트 다 받아와서 싹 다 지우고, is_represent OR 연산해서 하나 삽입하기
  const { rows: checkDuplicate } = await client.query(
    `
    SELECT tag_id, photo_id
    FROM photo_tag
    GROUP BY tag_id, photo_id
    HAVING count(*) > 1 
    `,
  );
  console.log(checkDuplicate);

  if(checkDuplicate){
    const { rows: duplicateData } = await client.query(
      `
      SELECT *
      FROM photo_tag
      WHERE tag_id = $1 AND photo_id = $2
      `,
      [checkDuplicate[0].tag_id, checkDuplicate[0].photo_id]
    );
    console.log(duplicateData);
    
    //DELETE하기
    const deleteIds = duplicateData.map(x => x.id);
    for(let i = 0; i < deleteIds.length ; i++){
      const { rows: deleteData } = await client.query(
        `
        DELETE FROM photo_tag
        WHERE id = $1
        `,
        [deleteIds[i]]
      );
    }
  
    //OR연산해서 is_represent 값 가져오기, created_at 가장 오래된 것 가져오기
    var new_is_represent : boolean = false;
    var new_created_at = duplicateData[0].created_at;
  
    for(let i = 0; i < duplicateData.length; i++){
      new_is_represent = new_is_represent || duplicateData[i].is_represent;
      console.log(new_created_at + " /// " + duplicateData[i].created_at);
      
      if(dayjs(new_created_at) > dayjs(duplicateData[0].created_at)){
          new_created_at = duplicateData[0].created_at;
      }
    }
  
    //하나 Insert하기
    const { rows: insertData } = await client.query(
      `
      INSERT INTO photo_tag
      (created_at, updated_at, tag_id, photo_id, is_represent)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [new_created_at, new Date(), duplicateData[0].tag_id, duplicateData[0].photo_id, new_is_represent]
    );
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
    ORDER BY updated_at DESC, name ASC
    LIMIT 6
    `,
    [userId, GENERAL]
  );
  const { rows : oftenTags } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE user_id = $1 AND tag_type = $2
    ORDER BY add_count DESC, name ASC
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
    ORDER BY add_count DESC, name ASC
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
    // "platform" : {
    //   "tags" : platformTagArr
    // }
  };

  return data;
}

const getOftenSearchTags = async (client: any, userId: number) => {
  const { rows : oftenSearchTags } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE user_id = $1
    ORDER BY search_count DESC, name ASC
    LIMIT 6
    `,
    [userId]
  );

  const data = {
    "tags" : oftenSearchTags.map(x => {
      return {"id" : x.id, "name" : x.name}
    })
  };
  return data;
}

//북마크 즐겨찾기 추가
const addBookmark = async (client: any, userId: number, tagId: number) => {
  const { rows: checkBookmarkAdd } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE tag.user_id = $1
    AND id = $2
    `,
    [userId, tagId]
  );
  // 북마크가 체크가 되어있을 시에 404 에러를 던져줌
  if (checkBookmarkAdd[0].bookmark_status == true) {
    throw 400;
  }

  const { rows } = await client.query(
    `
        UPDATE tag
        SET bookmark_status = true
        where user_id = $1
        AND id = $2
        `,
    [userId, tagId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

//북마크 즐겨찾기 취소
const deleteBookmark = async (client: any, userId: number, tagId: number) => {
  const { rows: checkBookmarkDelete } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE tag.user_id = $1
    AND id = $2
    `,
    [userId, tagId]
  );
  // 북마크가 체크가 되어있을 시에 404 에러를 던져줌
  if (checkBookmarkDelete[0].bookmark_status == false) {
    throw 400;
  }
  const { rows } = await client.query(
    `
        UPDATE tag
        SET bookmark_status = false
        where user_id = $1
        AND id = $2
        `,
    [userId, tagId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

export default {
  getTagNames,
  updateTag,
  deleteTag,
  getMainTags,
  getOftenSearchTags, addBookmark,
  deleteBookmark,
};