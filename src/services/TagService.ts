import { PushCreateRequest } from "../interfaces/push/request/PushCreateRequest";
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import { PhotoPostDTO, PhotoReturnDTO } from '../DTO/photoDTO';
import dayjs from 'dayjs';

const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const getTagNames = async (client: any, userId: number) => {
  const { rows } = await client.query(
    `
    SELECT tag.id, tag.name, tag.bookmark_status, photo.image_url
    FROM tag, photo_tag, photo
    WHERE tag.user_id = $1 AND tag.is_deleted = false
    AND tag.id = photo_tag.tag_id AND photo_tag.is_deleted = false
    AND photo_tag.photo_id = photo.id AND photo.is_deleted = false
    `,
    [userId],
  );
  console.log(rows[0]);
  const data = {
    "tags" : rows
  };
  
  return data;
};

export default {
  getTagNames
}
