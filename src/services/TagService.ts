import { PushCreateRequest } from "../interfaces/push/request/PushCreateRequest";
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";
import { PhotoPostDTO, PhotoReturnDTO } from "../DTO/photoDTO";
import dayjs from "dayjs";
import { TagnameUpdateRequest } from "../interfaces/tag/TagnameUpdateRequest";

const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

const getTagNames = async (client: any, userId: number) => {
  const { rows } = await client.query(
    `
    SELECT tag.id, tag.name, tag.bookmark_status, photo.image_url
    FROM tag, photo_tag, photo
    WHERE tag.user_id = $1 AND tag.is_deleted = false
    AND tag.id = photo_tag.tag_id AND photo_tag.is_deleted = false
    AND photo_tag.photo_id = photo.id AND photo.is_deleted = false
    `,
    [userId]
  );
  console.log(rows[0]);
  const data = {
    tags: rows,
  };

  return data;
};

//수정하려고하는 태그가 이미 존재하는지 확인 (userId, tagName으로 검색) -> 존재하지 않으면 tag 새로 생성 , 태그가 이미 존재하면 해당 tagId 받아옴
//수정 전 태그가 마지막으로 남은 태그인지 확인 photo_tag에서 tag_id 갯수 세서 1개면 -> tag테이블에서 해당 tag is_deleted = true로 변경하기
//이미 해당 태그에 존재하는 사진들을 모두 다 새로 생성된 태그로 이동해야 함 -> photo_tag tag_id를 이전 tagId에서 -> 새로 생성한 태그id로 update하기

const updateTagName = async (
  client: any,
  userId: number,
  tagId: number,
  tagNameUpdateRequest: TagnameUpdateRequest
) => {
  //수정하려고하는 태그가 이미 존재하는지 확인 (userId, tagName으로 검색) -> 존재하지 않으면 tag 새로 생성 , 태그가 이미 존재하면 해당 tagId 받아옴
  const { rows: exist } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE tag.user_id = $1 AND tag.name = $2
    AND tag.is_deleted = false
    `,
    [userId, tagNameUpdateRequest.name]
  );
  console.log(exist[0]);
  //수정하려고 하는 태그가 이미 존재하는가?
  let newTagId = exist[0].id;

  if (exist.length < 1) {
    //존재X
    //태그 새로 생성
    const { rows: createPhotoTag } = await client.query(
      `
      INSERT INTO tag
      (name, tag_type, user_id)
      VALUE ($1, $2, $3);
      `,
      [tagNameUpdateRequest.name, exist[0].tagType, userId]
    );
    newTagId = createPhotoTag[0].tag_id;
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
  console.log(checkLastTag[0]);
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

export default {
  getTagNames,
  updateTagName,
};
