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

const updatePhotoTag = async (client: any, userId: number, name: string, photoIds: number[], tagId: number, tagType: string) => {
  const { rows: checkedTag } = await client.query(
    `
    SELECT id, is_deleted
    FROM tag
    WHERE name = $1 AND user_id = $2
    `,
    [name, userId],
  );
  let newTagId;
  const photoCount = photoIds.length;
  if (!checkedTag[0]) {
    const { rows } = await client.query(
      `
      INSERT INTO tag(name, tag_type, user_id, add_count)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [name, tagType, userId, photoCount],
    );
    newTagId = rows[0].id;
  } else {
    if (checkedTag[0].is_deleted === true) {
      const { rows } = await client.query(
        `
        UPDATE tag
        SET is_deleted = false
        WHERE name = $1 AND user_id = $2 AND tag_type = $3
        RETURNING *
        `,
        [name, userId, tagType],
      );
    }
    newTagId = checkedTag[0].id;
    const { rows } = await client.query(
      `
      UPDATE tag
      SET add_count = add_count + $4
      WHERE name = $1 AND user_id = $2 AND id = $3 AND tag_type = $5
      RETURNING *
      `,
      [name, userId, newTagId, photoCount, tagType],
    );
  }

  for (let i of photoIds) {
    const { rows: representTag } = await client.query(
      `
      SELECT is_represent
      FROM photo_tag
      WHERE tag_id = $1 AND is_deleted = false AND photo_id = $2
      `,
      [tagId, i],
    );
    const represent = representTag[0].is_represent;

    const { rows } = await client.query(
      `
      UPDATE photo_tag
      SET tag_id = $1, is_represent=$4
      WHERE photo_id = $2 AND tag_id = $3
      RETURNING *
      `,
      [newTagId, i, tagId, represent],
    );
  }

  const { rows: photoTag } = await client.query(
    `
    SELECT *
    FROM photo_tag
    WHERE tag_id = $1 AND is_deleted = false
    `,
    [tagId],
  );
  if (!photoTag[0]) {
    const { rows } = await client.query(
      `
      UPDATE tag
      SET is_deleted = true
      WHERE id = $1
      RETURNING *
      `,
      [tagId],
    );
  }
};

export default {
  createPhotoTag,
  getTagByPhotoId,
  updatePhotoTag,
};
