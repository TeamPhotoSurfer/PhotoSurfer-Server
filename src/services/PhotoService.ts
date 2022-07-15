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

const getPhotoById = async (client: any, photoId: number, userId: number) => {
  const { rows } = await client.query(
    `
    SELECT id, image_url
    FROM photo
    WHERE id = $1
    `,
    [photoId],
  );

  const { rows: tag } = await client.query(
    `
    SELECT tag.id, tag.name
    FROM photo, photo_tag, tag
    WHERE photo.id = $1 AND photo.user_id = $2 AND photo.is_deleted = false
    AND photo.id = photo_tag.photo_id AND photo_tag.is_deleted = false
    AND photo_tag.tag_id = tag.id AND tag.is_deleted = false
    `,
    [photoId, userId],
  );
  const data = {
    id: rows[0].id,
    imageUrl: rows[0].image_url,
    tags: tag,
  };
  return convertSnakeToCamel.keysToCamel(data);
};
export default {
  createPhotoTag,
  getTagByPhotoId,
  getPhotoById,
};
