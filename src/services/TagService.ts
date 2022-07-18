const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

//북마크 즐겨찾기 추가
const addBookmark = async (client: any, userId: number, tagId: number) => {
  const { rows: checkBookmarkAdd } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE tag.user_id = $1
    AND id = $2
    `,
    [userId, tagId]
  );
  // 북마크가 체크가 되어있을 시에 404 에러를 던져줌
  if (checkBookmarkAdd[0].bookmark_status == true) {
    throw 400;
  }

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
const deleteBookmark = async (client: any, userId: number, tagId: number) => {
  const { rows: checkBookmarkDelete } = await client.query(
    `
    SELECT *
    FROM tag
    WHERE tag.user_id = $1
    AND id = $2
    `,
    [userId, tagId]
  );
  // 북마크가 체크가 되어있을 시에 404 에러를 던져줌
  if (checkBookmarkDelete[0].bookmark_status == false) {
    throw 400;
  }
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
  addBookmark,
  deleteBookmark,
};
