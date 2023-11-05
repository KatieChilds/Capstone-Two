"use strict";
process.env.NODE_ENV = "test";

const db = require("../../../db");
const User = require("../../../models/user");
const {
  createToken,
  getWeavyAccessToken,
} = require("../../../helpers/tokens");

const u1AccessToken = getWeavyAccessToken("u1");
const u2AccessToken = getWeavyAccessToken("u2");
const u3AccessToken = getWeavyAccessToken("u3");

async function commonBeforeAll() {
  // ensure db is empty
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM places");

  await User.register({
    username: "u1",
    password: "u1password",
    firstname: "user",
    lastname: "one",
    email: "u1@email.com",
    city: "Ottawa",
    country: "Canada",
    avatar:
      "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
    access_token: u1AccessToken,
  });

  await User.register({
    username: "u2",
    password: "u2password",
    firstname: "user",
    lastname: "two",
    email: "u2@email.com",
    city: "Ottawa",
    country: "Canada",
    avatar:
      "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
    access_token: u2AccessToken,
  });

  await User.register({
    username: "u3",
    password: "u3password",
    firstname: "user",
    lastname: "three",
    email: "u3@email.com",
    city: "Ottawa",
    country: "Canada",
    avatar:
      "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
    access_token: u3AccessToken,
  });

  await User.addChild("u1", {
    gender: "male",
    dob: "2020-12-30",
  });

  await User.addFriend("u1", "u2");
  await User.addFriend("u1", "u3");

  await User.savePlace("u1", "ChIJa2Q72ZIa0kwR7GMuasWj6IA");
  await User.savePlace("u1", "ChIJrxNRX7IFzkwR7RXdMeFRaoo");

  await User.leaveReview(
    "u1",
    "ChIJa2Q72ZIa0kwR7GMuasWj6IA",
    true,
    true,
    true,
    true,
    "Great coffee and atmosphere",
    4
  );

  await User.setDate(
    "u1",
    "ChIJa2Q72ZIa0kwR7GMuasWj6IA",
    "2023-11-20 14:30:00"
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({
  username: "u1",
  lat: 45.4215296,
  lng: -75.69719309999999,
  city: "Ottawa",
  country: "Canada",
  access_token: u1AccessToken,
});
const u2Token = createToken({
  username: "u2",
  lat: 45.4215296,
  lng: -75.69719309999999,
  city: "Ottawa",
  country: "Canada",
  access_token: u2AccessToken,
});
const u3Token = createToken({
  username: "u3",
  lat: 45.4215296,
  lng: -75.69719309999999,
  city: "Ottawa",
  country: "Canada",
  access_token: u3AccessToken,
});

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token,
};
