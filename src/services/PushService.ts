import { convertDateForm } from "../modules/convertDateForm";

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

const getLastPush = async (client: any, userId: number) => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  date.setHours(0, 0, 0, 0);

  const { rows } = await client.query(
    `SELECT push.id, push.push_date, photo.image_url, push.memo, push.photo_id
      FROM push, photo
      WHERE push.user_id = $1
      AND push.push_date <= $2 AND push.photo_id = photo.id
      ORDER BY push.push_date ASC
      `,
    [userId, date]
  );
  for (let i of rows) {
    const photoId = i.photo_id;
    const { rows: tags } = await client.query(
      `SELECT tag.name
          FROM photo_tag, tag
          WHERE photo_tag.photo_id = $1
          AND photo_tag.is_represent = true
          AND photo_tag.tag_id = tag.id
          `,
      [photoId]
    );
    const result = tags.map((x) => x.name);
    i.tags = result;
  }

  let totalCount = rows.length;
  rows.map((x) => (x.push_date = convertDateForm(x.push_date)));

  const data = {
    push: convertSnakeToCamel3.keysToCamel(rows),
    totalCount,
  };

  return convertSnakeToCamel3.keysToCamel(data);
};

export default { getLastPush };
