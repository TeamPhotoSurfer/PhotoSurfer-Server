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
  console.log(photoId);
  const { rows: photo } = await client.query(
    `UPDATE photo 
    SET is_deleted = true 
    WHERE id in (${photoId});`
  );

  const { rows } = await client.query(
    `UPDATE photo_tag
    SET is_deleted = true 
    WHERE photo_id in (${photoId})
    RETURNING *;`
  );
  const { rows: push } = await client.query(
    `UPDATE push
    SET is_deleted = false
    WHERE photo_id in (${photoId});`
  );

  for (let i of rows) {
    const { rows: photoTag } = await client.query(
      `SELECT *
    FROM photo_tag
    WHERE tag_id = $1
    AND is_deleted = false;`,
      [i.tag_id]
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
