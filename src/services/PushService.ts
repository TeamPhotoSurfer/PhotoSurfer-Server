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
  const date2 = new Date();
  date2.setDate(date2.getDate() - 1);
  console.log(date2);
  console.log(date.getDate() - 2);
  console.log(date);
  const { rows } = await client.query(
    `SELECT * FROM push WHERE user_id = $1 AND push_date <= $2;`,
    [userId, date2]
  );
  console.log(date.getDate() - 2);

  console.log(rows);

  return convertSnakeToCamel3.keysToCamel(rows);
};

export default { getLastPush };
