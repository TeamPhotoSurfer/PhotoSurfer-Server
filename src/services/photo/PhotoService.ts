import connect from "../../loaders/db";
import connection from "../../loaders/db";
const mysql = require("mysql");

//Photo 지우기
const deletePhoto = async (photoId: string) => {
  connection.connect();
  const deletePhotoTag = `UPDATE photo SET is_deleted = true WHERE id = ${photoId}`;
  const deletePhotoTag2 = `SELECT tag_id FROM photo_tag WHERE is_deleted = false`;

  connection.query(
    deletePhotoTag,
    function (err: any, results: any, fields: any) {
      if (err) {
        console.log(err);
      }
      console.log(results);
      connection.query(
        deletePhotoTag2,
        function (err: any, results: any, fields: any) {
          if (err) {
            console.log(err);
            console.log(results);
            connection.end();
          }
        }
      );
      return results;
    }
  );
};

export default { deletePhoto };
