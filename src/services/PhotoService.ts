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

const putPhoto = async (client: any, photoIds: any[]) => {
  const photoIdArr = photoIds.map((x) => +x);
  console.log(photoIdArr);

  const { rows } = await client.query(
    `UPDATE photo_tag SET is_deleted = true 
    WHERE id in (${photoIdArr});`
  );

  const { rows: pho } = await client.query(
    `UPDATE photo SET is_deleted = true 
    WHERE id in (${photoIdArr});`
  );

  const { rows: phot } = await client.query(
    `SELECT tag_id FROM photo_tag GROUP BY tag_id HAVING COUNT(tag_id) <= 1 ;`
  );
  
  const { rows: photo } = await client.query(
    `UPDATE tag SET is_deleted = true
    where id in (${photoIdArr});`
  );

  return convertSnakeToCamel3.keysToCamel(rows);
};

export default {
  test,
  putPhoto,
};
