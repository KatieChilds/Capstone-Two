const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const {
  WEAVY_API_KEY,
  WEAVY_SERVER,
} = require("../dot-env");
const axios = require("axios");
/** return signed JWT from user data. */

function createToken(user) {
  let payload = {
    username: user.username,
    city: user.city,
    country: user.country,
    access_token: user.access_token,
  };

  return jwt.sign(payload, SECRET_KEY);
}

async function getWeavyAccessToken(user) {
  console.log("USER?", user);

  const weavyUser = await axios.post(
    `${WEAVY_SERVER}/api/users/${user}/tokens`,
    JSON.stringify({
      name: `${user}`,
      expires_in: 315360000,
    }),
    {
      headers: {
        Authorization: `Bearer ${WEAVY_API_KEY}`,
        "Content-type": "application / json",
      },
    }
  );

  console.log(weavyUser.data.access_token);
  return weavyUser.data.access_token;
}
module.exports = { createToken, getWeavyAccessToken };
