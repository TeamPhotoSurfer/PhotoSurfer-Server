const convertSnakeToCamel3 = require("../modules/convertSnakeToCamel");

const test = async (client: any) => {
  const { rows } = await client.query(
    `
      INSERT INTO "user" (name, email, social_type)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
    ["dd", "anam", "kakao"]
  );
  return convertSnakeToCamel3.keysToCamel(rows[0]);
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

  return convertSnakeToCamel3.keysToCamel(rows);
};

export default {
  test,
  deletePhoto,
};
