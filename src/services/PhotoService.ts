import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { PhotoPostDTO, PhotoReturnDTO } from '../DTO/photoDTO';
const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

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

const addPhotoTag = async (client: any, userId: number, photoId: string[] | string, name: string, type: string) => {
  const { rows: checkedTag } = await client.query(
    `
    SELECT id, is_deleted
    FROM tag
    WHERE name = $1 AND user_id = $2 AND is_deleted = false
    `,
    [name, userId],
  );
  let tagId;
  const photoCount = photoId.length;
  if (!checkedTag[0]) {
    const { rows: newTag } = await client.query(
      `
        INSERT INTO tag(name, tag_type, user_id, add_count)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `,
      [name, type, userId, photoCount],
    );
    tagId = newTag[0].id;
  } else {
    if (checkedTag[0].is_deleted === true) {
      const { rows } = await client.query(
        `
        UPDATE tag
        SET is_deleted = false
        WHERE name = $1 AND user_id = $2 AND tag_type = $3
        RETURNING *
        `,
        [name, userId, type],
      );
    }
    tagId = checkedTag[0].id;
    const { rows } = await client.query(
      `
      UPDATE tag
      SET add_count = add_count + $4, updated_at = now()
      WHERE name = $1 AND user_id = $2 AND id = $3 AND tag_type = $5
      RETURNING *
      `,
      [name, userId, tagId, photoCount, type],
    );
  }

  //이미 사진에 속해있는 태그인 경우
  const { rows } = await client.query(
    `
      SELECT *
      FROM photo_tag
      WHERE photo_id in (${photoId}) AND tag_id = $1
      `,
    [tagId],
  );

  if (rows[0]) {
    throw 400;
  }

  for (let i of photoId) {
    const { rows } = await client.query(
      `
        INSERT INTO photo_tag(tag_id, photo_id)
        VALUES ($1, $2)
        RETURNING *
        `,
      [tagId, i],
    );
  }

  const data = {
    tagId,
    name,
  };
  return convertSnakeToCamel.keysToCamel(data);
};

export default {
  createPhotoTag,
  getTagByPhotoId,
  addPhotoTag,
};
