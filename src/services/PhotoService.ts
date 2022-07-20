import { PushCreateRequest } from '../interfaces/push/request/PushCreateRequest';
import { throws } from 'assert';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { EventListenerTypes } from 'typeorm/metadata/types/EventListenerTypes';
import { PhotoPostDTO, PhotoReturnDTO } from '../DTO/photoDTO';
import dayjs from 'dayjs';

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

const deletedPhotoTag = async (client: any, userId: number, tagId: number, photoIds: number[]) => {
  const { rows: deleteRow } = await client.query(
    `
    UPDATE photo_tag
    SET is_deleted=true
    WHERE tag_id = $1 AND photo_id in (${photoIds})
    RETURNING *
    `,
    [tagId],
  );
  let countDeletedPhoto = 0;
  for (let i of photoIds) {
    //사진에 태그가 안남았을 때
    const { rows: tag } = await client.query(
      `
      SELECT *
      FROM photo_tag
      WHERE photo_id = $1 AND is_deleted = false
      `,
      [i],
    );
    if (!tag[0]) {
      const { rows } = await client.query(
        `
        UPDATE photo
        SET is_deleted=true
        WHERE id = $1
        RETURNING *
        `,
        [i],
      );
      countDeletedPhoto++;
    }
  }

  //태그에 사진이 하나도 안남았을 때
  const { rows } = await client.query(
    `
    SELECT *
    FROM photo_tag
    WHERE tag_id = $1 AND is_deleted = false
    `,
    [tagId],
  );

  if (!rows[0]) {
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
  return { countDeletedPhoto };
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

const getPhotoById = async (client: any, photoId: number, userId: number) => {
  const { rows } = await client.query(
    `
    SELECT photo.id as photoId, image_url
    FROM photo
    WHERE photo.id = $1 AND photo.is_deleted = false AND photo.user_id = $2
    `,
    [photoId, userId],
  );

  if (!rows[0]) {
    throw 404;
  }
  const { rows: push } = await client.query(
    `
    SELECT id
    FROM push
    WHERE photo_id = $1 AND user_id = $2 AND is_deleted = false
    `,
    [photoId, userId],
  );

  let pushId;
  if (!push[0]) {
    pushId = null;
  } else {
    pushId = push[0].id;
  }

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
    id: rows[0].photoid,
    imageUrl: rows[0].image_url,
    tags: tag,
    push: pushId,
  };
  return convertSnakeToCamel.keysToCamel(data);
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
    //만약 사진에 새 태그가 이미 있을 때
    const { rows: existPhotoTag } = await client.query(
      `
      SELECT *
      FROM photo_tag
      WHERE tag_id = $1 AND is_deleted = false AND photo_id = $2
      `,
      [newTagId, i],
    );
    if (existPhotoTag[0]) {
      console.log(existPhotoTag);
      continue;
    }

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

  //기존 태그에 사진이 더이상 없을 때
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
  const data = {
    id: newTagId,
    name,
  };
  return data;
};

const getTag = async (client: any, userId: number) => {
  const { rows } = await client.query(
    `
    SELECT id, name
    FROM tag
    WHERE is_deleted = false AND user_id = $1
    `,
    [userId],
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

const deletePhoto = async (client: any, photoId: number, userId: number) => {
  const { rows: checkPhotoExist } = await client.query(
    `SELECT *
    FROM photo
    WHERE id in (${photoId})
    AND user_id = $1
    AND is_deleted = false;
    `,
    [userId]
  );
  
  if (!checkPhotoExist[0]) {
    console.log("사진 삭제 에러");
    throw 400;
  }

  const { rows: photo } = await client.query(
    `UPDATE photo 
    SET is_deleted = true 
    WHERE id in (${photoId})
    AND user_id = $1;
    `,
    [userId]
  );

  const { rows } = await client.query(
    `UPDATE photo_tag
    SET is_deleted = true
    WHERE photo_id in (${photoId});
    `,
  );
    
    // 푸시 알림 삭제
    const { rows: push } = await client.query(
      `UPDATE push
      SET is_deleted = true
      WHERE photo_id in (${photoId});
      `,
    );
  
  for (let i of rows) {
    const { rows: photoTag } = await client.query(
      `SELECT *
    FROM photo_tag
    WHERE tag_id = $1
    AND is_deleted = false;`,
      [i.tag_id, userId]
    );
    if (photoTag.length == 0) {
      const { rows: tag } = await client.query(
        `UPDATE tag
        SET is_deleted = true
        WHERE id = $1;`,
        [i.tag_id]
      );
    }
  }

  return convertSnakeToCamel.keysToCamel(rows);
};
export default {
  updatePhotoTag,
  deletedPhotoTag,
  addPhotoTag,
  findPhotoByTag,
  getTagsByIds,
  getPhotoById,
  createPhotoTag,
  getTagByPhotoId,
  getTag,
  deletePhoto
};
