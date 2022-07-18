import { convertDateForm } from "../modules/convertDateForm";

const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

// 다가오는 알림 조회
const getComePush = async (client: any, userId: number) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(0, 0, 0, 0);

  const date2 = new Date();
  date2.setDate(date2.getDate() + 5);
  date2.setHours(0, 0, 0, 0);

  const { rows } = await client.query(
    `SELECT push.id, push.push_date, photo.image_url, push.memo, push.photo_id
    FROM push, photo
    WHERE push.user_id = $1
    AND $2 <= push.push_date AND push.push_date <= $3 AND push.photo_id = photo.id
    ORDER BY push.push_date ASC
    `,
    [userId, date, date2]

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
    push: convertSnakeToCamel.keysToCamel(rows),
    totalCount,
  };

  return convertSnakeToCamel.keysToCamel(data);
};

export default { getComePush };
