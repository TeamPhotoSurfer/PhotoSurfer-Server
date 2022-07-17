const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

//북마크 즐겨찾기 추가
const bookmarkAdd = async (client: any, userId: number, tagId: number) => {
  const { rows } = await client.query(
    `
        UPDATE tag
        SET bookmark_status = true
        where user_id = $1
        AND id = $2
        `,
    [userId, tagId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

//북마크 즐겨찾기 취소
const bookmarkDelete = async (client: any, userId: number, tagId: number) => {
  const { rows } = await client.query(
    `
        UPDATE tag
        SET bookmark_status = false
        where user_id = $1
        AND id = $2
        `,
    [userId, tagId]
  );
  return convertSnakeToCamel.keysToCamel(rows);
};

export default {
  bookmarkAdd,
  bookmarkDelete,
};
