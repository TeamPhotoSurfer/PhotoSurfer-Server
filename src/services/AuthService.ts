import { userInputDTO, userSearchInput } from "../DTO/AuthDTO";
const convertSnakeToCamel = require("../modules/convertSnakeToCamel");

const findUserByEmail = async (
  client: any,
  email: string,
  socialType: string
) => {
  const { rows } = await client.query(
    `
    SELECT *
    FROM "user"
    WHERE email = $1 AND social_type = $2
    `,
    [email, socialType]
  );
  return convertSnakeToCamel.keysToCamel(rows[0]);
};
const createUser = async (client: any, data: userInputDTO) => {
  const { rows: createUser } = await client.query(
    `
        INSERT INTO "user"(name, email, social_type)
        VALUES ($1, $2, $3)
        `,
    [data.name, data.email, data.socialType]
  );
  return convertSnakeToCamel.keysToCamel(createUser);
};

export default {
  findUserByEmail,
  createUser,
};
