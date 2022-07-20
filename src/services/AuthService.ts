import { userInputDTO, userSearchInput } from '../DTO/AuthDTO';
const convertSnakeToCamel = require('../modules/convertSnakeToCamel');

const findUserByEmail = async (client: any, email: string, socialType: string) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM "user"
    WHERE email = $1 AND social_type = $2
    `,
    [email, socialType],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};
const createUser = async (client: any, data: userInputDTO) => {
  const { rows: createUser } = await client.query(
    `
        INSERT INTO "user"(name, email, social_type, fcm_token)
        VALUES ($1, $2, $3, $4)
        `,
    [data.name, data.email, data.socialType, data.fcmToken],
  );
  return convertSnakeToCamel.keysToCamel(createUser);
};
const updateFcm = async (client: any, fcm: string, userId: number) => {
  const { rows } = await client.query(
    `
    UPDATE "user"
    SET fcm_token = $1
    WHERE id = $2
    RETURNING *
    `,
    [fcm, userId],
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};

export default {
  findUserByEmail,
  createUser,
  updateFcm,
};
