"use strict";

const request = require("supertest");

const app = require("../../../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/token */
describe("POST /auth/token", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "u1",
        password: "u1password",
      });
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "no-such-user",
        password: "u1password",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "u1",
        password: "wrongpassword",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: "u1",
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/token")
      .send({
        username: 42,
        password: "usernameNumberNotString",
      });
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** POST /auth/register */
describe("POST /auth/register", function () {
  test("works", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "new",
        password: "password",
        firstname: "first",
        lastname: "last",
        email: "new@email.com",
        city: "Ottawa",
        country: "Canada",
        avatar:
          "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
      });
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      token: expect.any(String),
    });
  });

  test("bad request with missing fields", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "new",
      });
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/auth/register")
      .send({
        username: "new",
        password: "password",
        firstname: "first",
        lastname: "last",
        email: "not-an-email",
        city: "Ottawa",
        country: "Canada",
        avatar:
          "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
      });
    expect(resp.statusCode).toEqual(400);
  });
});
