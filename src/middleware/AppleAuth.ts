const jwt = require("jsonwebtoken");

const appleAuth = async (appleAccessToken: string) => {
  try {
    const appleUser = jwt.decode(appleAccessToken);
    if (appleUser == "false") return null;

    return appleUser;
  } catch (error) {
    return null;
  }
};

export default { appleAuth };
