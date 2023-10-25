const bcrypt = require("bcrypt");
const db = require("../../../db");
const { BCRYPT_WORK_FACTOR } = require("../../../config");

async function commonBeforeAll() {
  // ensure db is empty
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM places");

  await db.query(
    `INSERT INTO users(username,
                        password,
                        first_name,
                        last_name,
                        email,
                        lat,
                        lng)
        VALUES('u1', $1, 'user', 'one', 'u1@email.com', 123, 456),
        ('u2', $2, 'user', 'two', 'u2@email.com', 123, 456),
        ('u3', $3, 'user', 'three', 'u3@email.com', 123, 456)
        RETURNING username
    `,
    [
      await bcrypt.hash("u1password", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("u2password", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("u3password", BCRYPT_WORK_FACTOR),
    ]
  );

  await db.query(
    `INSERT INTO children(parent_username, dob, gender)
    VALUES('u1', '2020-12-30', 'male')`
  );

  await db.query(
    `INSERT INTO friends(user_friending_username, user_friended_username)
    VALUES('u1', 'u2')`
  );

  await db.query(
    `INSERT INTO places(id, name, address, lat, lng, type)
    VALUES('abc123', 'test-place', '123 main street', '123', '456', 'place')`
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
