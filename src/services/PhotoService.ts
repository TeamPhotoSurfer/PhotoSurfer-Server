import { throws } from 'assert';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { EventListenerTypes } from 'typeorm/metadata/types/EventListenerTypes';
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
    //이미 존재하는 태그인지, 존재하는데 삭제되었는지, 있는지
    const { rows: checkedTag } = await client.query(
      `
        SELECT *
        FROM tag
        WHERE name = $1 AND user_id = $2
        `,
      [r.name, userId],
    );
    if (!checkedTag[0]) {
      const { rows: newTag } = await client.query(
        `
        INSERT INTO tag(name, tag_type, user_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [r.name, r.tagType, userId],
      );
      tagId = newTag[0].id;
    } else {
      if (checkedTag[0].is_deleted === true) {
        const { rows } = await client.query(
          `
          UPDATE tag
          SET is_deleted = false
          WHERE name = $1 AND user_id = $2
          `,
          [r.name, userId],
        );
      }
      tagId = checkedTag[0].id;
      const { rows } = await client.query(
        `
        UPDATE tag
        SET add_count = add_count + 1, updated_at = now()
        WHERE name = $1 AND user_id = $2 AND id = $3
        RETURNING *
        `,
        [r.name, userId, tagId],
      );
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

const findPhotoByTag = async (client: any, userId: number, tagId: string[] | string) => {
  if (typeof tagId === 'string') {
    const { rows } = await client.query(
      `
      SELECT photo.id, photo.image_url
      FROM photo_tag, photo
      WHERE tag_id = $1 AND photo_tag.is_deleted = false 
      AND photo.id = photo_tag.photo_id AND photo.user_id = $2 AND photo.is_deleted = false
      `,
      [tagId, userId],
    );
    if (!rows[0]) {
      throw 404;
    }
    return convertSnakeToCamel.keysToCamel(rows);
  }

  const { rows } = await client.query(
    `
      SELECT  photo_id
      FROM photo_tag, photo
      WHERE  photo_tag.is_deleted = false
      AND photo.id = photo_tag.photo_id AND photo.user_id = $1 AND photo.is_deleted = false
      `,
    [userId],
  );

  let arr: number[] = rows.map(x => x.photo_id);
  arr = [...new Set(arr)];

  for (let i of tagId) {
    const { rows } = await client.query(
      `
      SELECT photo_id
      FROM photo_tag, photo
      WHERE tag_id = $1 AND photo_tag.is_deleted = false
      AND photo.id = photo_tag.photo_id AND photo.user_id = $2 AND photo.is_deleted = false
      `,
      [i, userId],
    );
    let arr2 = rows.map(x => x.photo_id);
    arr2 = [...new Set(arr2)];
    arr = arr.filter(x => arr2.includes(x));
  }
  if (!arr[0]) {
    throw 404;
  }
  const { rows: result } = await client.query(
    `
        SELECT id, image_url
        FROM photo
        WHERE id in (${arr}) AND user_id = $1
        `,
    [userId],
  );

  return convertSnakeToCamel.keysToCamel(result);
};

const getTagsByIds = async (client: any, tagId: string[] | string, userId: number) => {
  const { rows: result } = await client.query(
    `
        SELECT id, name
        FROM tag
        WHERE id in (${tagId})
        `,
  );
  const { rows: searchCount } = await client.query(
    `
        UPDATE tag
        SET search_count = search_count + 1
        WHERE user_id = $1 AND id in(${tagId})
        `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(result);
};

export default {
  createPhotoTag,
  getTagByPhotoId,
  findPhotoByTag,
  getTagsByIds,
};
