import { convertDateForm } from "../modules/convertDateForm";

const convertSnakeToCamel3 = require("../modules/convertSnakeToCamel");

const getTodayPush = async (client: any, userId: number) => {
  const today = new Date();
  today.setDate(today.getDate());
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  dayAfterTomorrow.setHours(0, 0, 0, 0);

  //다가오는 알림 "오늘"
  const { rows } = await client.query(
    `SELECT push.id, push.push_date, photo.image_url, push.memo, push.photo_id
    FROM push, photo
    WHERE push.user_id = $1
    AND $2 <= push.push_date AND push.push_date < $3 AND push.photo_id = photo.id 
    ORDER BY push.push_date ASC
    `,
    [userId, today, tomorrow]
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
  const { rows: pushTomorrow } = await client.query(
    `SELECT push.id, push.push_date, photo.image_url, push.memo, push.photo_id
    FROM push, photo
    WHERE push.user_id = $1
    AND $2 <= push.push_date AND push.push_date < $3 AND push.photo_id = photo.id 
    ORDER BY push.push_date ASC
    `,
    [userId, tomorrow, dayAfterTomorrow]
  );

  for (let i of pushTomorrow) {
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

  //지난 알림목록 개수
  const dateCount = new Date();
  dateCount.setDate(dateCount.getDate() - 1);

  const { rows: last } = await client.query(
    `SELECT count(*)
    FROM push, photo
    WHERE push.user_id = $1
    AND push.push_date <= $2 AND push.photo_id = photo.id
    `,
    [userId, dateCount]
  );

  //다가오는 알림 개수
  const dateCome = new Date();
  dateCome.setDate(dateCome.getDate() + 1);

  const dateCome2 = new Date();
  dateCome2.setDate(dateCome2.getDate() + 5);

  const { rows: come } = await client.query(
    `SELECT count(*)
    FROM push, photo
    WHERE push.user_id = $1
    AND $2 <= push.push_date AND push.push_date <= $3 AND push.photo_id = photo.id
    `,
    [userId, dateCome, dateCome2]
  );

  let todayTomorrowCount = rows.length + pushTomorrow.length;
  rows.map((x) => (x.push_date = convertDateForm(x.push_date)));
  pushTomorrow.map((x) => (x.push_date = convertDateForm(x.push_date)));

  const data = {
    today: [rows],
    tomorrow: [pushTomorrow],
    todayTomorrowCount,
    lastCount: +last[0].count,
    comingCount: +come[0].count,
  };
  return convertSnakeToCamel3.keysToCamel(data);
};

export default { getTodayPush };
