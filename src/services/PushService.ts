import { convertDateForm } from "../modules/convertDateForm";
import dayjs from "dayjs";

const convertSnakeToCamel3 = require("../modules/convertSnakeToCamel");

const getTodayPush = async (client: any, userId: number) => {
  const date = new Date();
  date.setDate(date.getDate());
  date.setHours(0, 0, 0, 0);

  const date2 = new Date();
  date2.setDate(date2.getDate() + 1);
  date2.setHours(0, 0, 0, 0);

  const date3 = new Date();
  date3.setDate(date3.getDate() + 2);
  date3.setHours(0, 0, 0, 0);

  //다가오는 알림 "오늘"
  const { rows } = await client.query(
    `SELECT push.id, push.push_date, photo.image_url, push.memo, push.photo_id
    FROM push, photo
    WHERE push.user_id = $1
    AND $2 <= push.push_date AND push.push_date < $3 AND push.photo_id = photo.id 
    ORDER BY push.push_date DESC
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
  //다가오는 알림 "내일"
  const { rows: tomorrow } = await client.query(
    `SELECT push.id, push.push_date, photo.image_url, push.memo, push.photo_id
    FROM push, photo
    WHERE push.user_id = $1
    AND $2 <= push.push_date AND push.push_date < $3 AND push.photo_id = photo.id 
    ORDER BY push.push_date DESC
    `,
    [userId, date2, date3]
  );
  for (let i of tomorrow) {
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
  
  let totalCount = rows.length + tomorrow.length;
  rows.map((x) => (x.push_date = convertDateForm(x.push_date)));
  tomorrow.map((x) => (x.push_date = convertDateForm(x.push_date)));

  const data = {
    today: [rows],
    tomorrow: [tomorrow],
    totalCount,
  };

  return convertSnakeToCamel3.keysToCamel(data);
};

export default { getTodayPush };
