import { Imagebuilder } from "aws-sdk";
import { arrayBuffer } from "stream/consumers";

const convertSnakeToCamel3 = require("../modules/convertSnakeToCamel");

const getComePush = async (client: any, userId: number) => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  console.log(date);

  const date2 = new Date();
  date2.setDate(date2.getDate() + 5);
  console.log(date2);

  const { rows } = await client.query(
    `SELECT push.id, push.push_date, photo.image_url, push.memo, push.photo_id
    FROM push, photo
    WHERE push.user_id = $1
    AND $2 <= push.push_date AND push.push_date <= $3 AND push.photo_id = photo.id 
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

  const data = {
    rows,
    totalCount,
  };
  console.log(totalCount);
  console.log(rows);

  return convertSnakeToCamel3.keysToCamel(data);
};

export default { getComePush };
