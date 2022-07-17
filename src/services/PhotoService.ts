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

const deletePhoto = async (client: any, photoId: number) => {
  console.log(photoId);
  const { rows: photo } = await client.query(
    `UPDATE photo 
    SET is_deleted = true 
    WHERE id in (${photoId});`
  );

  // `SELECT tag_id
  // FROM photo_tag
  // GROUP BY tag_id
  // HAVING COUNT(tag_id) <= 1;
  // const { rows: tags } = await client.query(
  //   `SELECT *
  //   FROM photo_tag
  //   WHERE photo_id = $1
  //   AND is_deleted = false;`,
  //   [photoId]
  // );
  // `UPDATE tag
  // SET is_deleted = true
  // where id in (${photoId});`
  const { rows } = await client.query(
    `UPDATE photo_tag
    SET is_deleted = true 
    WHERE photo_id in (${photoId})
    RETURNING *;`
  );
  //포토태그 테이블에서 is_deleted = true 인 것 중에 tag_id를 뽑음
  // tag_id를 뽑은 후 태그테이블과 조인을해서 그중에 add_count 가 1인 것을 is_deleted = true를 해주기
  // select tag_id from photo_tag where is_deleted = true
  // update tag, photo_tag set is_deleted = true
  // where photo_tag.tag_id = tag.id
  // and add_count = 1

  // if (!rows[0]){
  //   const { rows: tag } = await client.query(
  //    `UPDATE tag
  // SET is_deleted = true
  // where id in (${photoId});`
  // );}
  for (let i of rows) {
    const { rows: photoTag } = await client.query(
      `SELECT *
    FROM photo_tag
    WHERE tag_id = $1
    AND is_deleted = false;`,
      [i.tag_id]
    );
    console.log(photoTag.length);
    if(photoTag.length == 0){
      const { rows: tag } = await client.query(
        `UPDATE tag
        SET is_deleted = true
        WHERE id = $1;`,
        [i.tag_id]
      );
    }
  }

  // update tag, photo_tag set is_deleted = true
  // where photo_tag.tag_id = tag.id
  // and add_count = 1
  return convertSnakeToCamel3.keysToCamel(rows);
};

export default {
  test,
  deletePhoto,
};
