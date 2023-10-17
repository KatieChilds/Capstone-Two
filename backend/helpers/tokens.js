const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const axios = require("axios");
require("dotenv").config();
const WEAVY_API_KEY = process.env.WEAVY_API_KEY;
const WEAVY_SERVER = process.env.WEAVY_SERVER;
/** return signed JWT from user data. */

function createToken(user) {
  let payload = {
    username: user.username,
    lat: user.lat,
    lng: user.lng,
    access_token: user.access_token,
  };

  return jwt.sign(payload, SECRET_KEY);
}

async function getWeavyAccessToken(user) {
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

  return weavyUser.data.access_token;
}
module.exports = { createToken, getWeavyAccessToken };
