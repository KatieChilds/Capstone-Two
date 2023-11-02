"use strict";

const request = require("supertest");

const db = require("../../../db.js");
const app = require("../../../app");
const User = require("../../../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u3Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** GET /users */
describe("GET /users", function () {
  test("works logged in user", async function () {
    const resp = await request(app)
      .get("/users")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      users: [
        {
          username: "u1",
          firstname: "user",
          avatar:
            "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
        },
        {
          username: "u2",
          firstname: "user",
          avatar:
            "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
        },
        {
          username: "u3",
          firstname: "user",
          avatar:
            "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
        },
      ],
    });
  });

  test("unauth for not logged in user", async function () {
    const resp = await request(app).get("/users");

    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /users/:username */
describe("GET /users/:username", function () {
  test("works for same user with children", async function () {
    const resp = await request(app)
      .get("/users/u1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstname: "user",
        lastname: "one",
        email: "u1@email.com",
        lat: 45.4215296,
        lng: -75.69719309999999,
        avatar:
          "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
        children: [{ age: "3 years", gender: "male" }],
      },
    });
  });

  test("works for same user no children", async function () {
    const resp = await request(app)
      .get("/users/u2")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u2",
        firstname: "user",
        lastname: "two",
        email: "u2@email.com",
        lat: 45.4215296,
        lng: -75.69719309999999,
        avatar:
          "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
        children: [],
      },
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get("/users/u1")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get("/users/u1");
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** PATCH /users/:username */
describe("PATCH /users/:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .patch("/users/u1")
      .send({
        firstname: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstname: "New",
        lastname: "one",
        email: "u1@email.com",
        lat: 45.4215296,
        lng: -75.69719309999999,
        avatar:
          "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
        children: [{ age: "3 years", gender: "male" }],
      },
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .patch("/users/u1")
      .send({
        firstname: "new",
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .patch("/users/u1")
      .send({
        firstname: "new",
      });
    expect(resp.statusCode).toEqual(401);
  });

  // thrown: "Exceeded timeout of 5000 ms for a test
  // console logs in route shows correct error from validator to trigger Bad Request Error and status code of 400.
  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .patch("/users/u1")
      .send({
        firstname: 42,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("works: can set new password", async function () {
    const resp = await request(app)
      .patch("/users/u1")
      .send({
        password: "new-password",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstname: "user",
        lastname: "one",
        email: "u1@email.com",
        lat: 45.4215296,
        lng: -75.69719309999999,
        avatar:
          "/static/media/user_default_avatar.557587208eb9e232f2ca.png",
        children: [{ age: "3 years", gender: "male" }],
      },
    });
    const isSuccessful = await User.authenticate(
      "u1",
      "new-password"
    );
    expect(isSuccessful).toBeTruthy();
  });
});

/************************************** DELETE /users/:username */
describe("DELETE /users/:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .delete("/users/u1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "u1" });
  });

  test("unauth if not same user", async function () {
    const resp = await request(app)
      .delete("/users/u1")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete("/users/u1");
    expect(resp.statusCode).toEqual(401);
  });
});

/******************************* POST /users/:username/children/add */
describe("POST /users/:username/children/add", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .post("/users/u2/children/add")
      .send({
        gender: "female",
        dob: "2021-11-10",
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.body).toEqual({
      children: [{ age: "2 years old", gender: "female" }],
    });
    expect(resp.statusCode).toEqual(201);
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .post("/users/u2/children/add")
      .send({
        gender: "female",
        dob: "2021-11-10",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .post("/users/u2/children/add")
      .send({
        gender: "female",
        dob: "2021-11-10",
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if data missing", async function () {
    const resp = await request(app)
      .post("/users/u2/children/add")
      .send({
        gender: "female",
      })
      .set("authorization", `Bearer ${u2Token}`);

    expect(resp.statusCode).toEqual(400);
  });

  test("bad request if invalid data", async function () {
    const resp = await request(app)
      .post("/users/u2/children/add")
      .send({
        gender: "female",
        dob: 2021,
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/******************** POST /users/:username/friends/:user_friended/add */
describe("POST /users/:username/friends/:user_friended/add", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .post("/users/u2/friends/u3/add")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      friended: "u3",
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .post("/users/u2/friends/u3/add")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).post(
      "/users/u2/friends/u3/add"
    );
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such user to friend", async function () {
    const resp = await request(app)
      .get("/users/u1/friends/nope")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** GET /users/:username/friends */
describe("GET /users/:username/friends", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get("/users/u1/friends")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      friends: ["u2", "u3"],
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get("/users/u1/friends")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get(
      "/users/u1/friends"
    );
    expect(resp.statusCode).toEqual(401);
  });
});

/*************** DELETE /users/:username/friends/:user_friended/remove */
describe("DELETE /users/:username/friends/:user_friended/remove", function () {
  test("works for same user with friendship", async function () {
    const resp = await request(app)
      .delete("/users/u1/friends/u2/remove")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      unfriended: "u2",
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .delete("/users/u1/friends/u2/remove")
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(
      "/users/u1/friends/u2/remove"
    );
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for friended user", async function () {
    const resp = await request(app)
      .delete("/users/u1/friends/u2/remove")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such friendship", async function () {
    const resp = await request(app)
      .delete("/users/u2/friends/u3/remove")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** POST /users/place/search */
describe("POST /users/place/search", function () {
  test("works for logged in user", async function () {
    const resp = await request(app)
      .post("/users/place/search")
      .send({
        searchName: "Ottawa Canada",
        lat: 45.4,
        lng: -75.7,
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      place: {
        place_id: "ChIJrxNRX7IFzkwR7RXdMeFRaoo",
        name: "Ottawa",
        address: "Ottawa, ON, Canada",
        lat: 45.4215296,
        lng: -75.69719309999999,
        type: "locality",
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .post("/users/place/search")
      .send({ searchName: "Ottawa Canada" });
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /users/places/:id */
describe("GET /users/places/:id", function () {
  test("works for logged in user", async function () {
    const resp = await request(app)
      .get("/users/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      place: {
        name: "Equator Coffee Roasters",
        address:
          "451 Ottawa St, Almonte, ON K0A 1A0, Canada",
        type: "cafe",
        reviews: [
          {
            user: "u1",
            content: {
              bathroom: true,
              changingTable: true,
              highchair: true,
              parking: true,
              otherNotes: "Great coffee and atmosphere",
            },
            stars: 4,
            date: expect.any(String),
            id: expect.any(Number),
          },
        ],
      },
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get(
      "/users/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA"
    );
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such place", async function () {
    const resp = await request(app)
      .get("/users/places/no-such-place")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/********************************* POST /users/:username/places/:id */
describe("POST /users/:username/places/:id", function () {
  test("works for same user with saved place", async function () {
    const resp = await request(app)
      .post("/users/u2/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      Saved: "Place: ChIJa2Q72ZIa0kwR7GMuasWj6IA",
    });
  });

  test("works for same user with new place", async function () {
    const resp = await request(app)
      .post("/users/u2/places/ChIJpTvG15DL1IkRd8S0KlBVNTI")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      Saved: "Place: ChIJpTvG15DL1IkRd8S0KlBVNTI",
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .post("/users/u2/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA")
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).post(
      "/users/u2/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA"
    );
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if place already saved for user", async function () {
    const resp = await request(app)
      .post("/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users/:username/places/ */
describe("GET /users/:username/places", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get("/users/u1/places")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      places: [
        {
          name: "Equator Coffee Roasters",
          lat: 45.2351633,
          lng: -76.1812327,
          id: "ChIJa2Q72ZIa0kwR7GMuasWj6IA",
          type: "cafe",
        },
        {
          name: "Ottawa",
          lat: 45.4215296,
          lng: -75.69719309999999,
          id: "ChIJrxNRX7IFzkwR7RXdMeFRaoo",
          type: "locality",
        },
      ],
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get("/users/u1/places")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get("/users/u1/places");
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no saved places for user", async function () {
    const resp = await request(app)
      .get("/users/u2/places")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/******************************** DELETE /users/:username/places/:id */
describe("DELETE /users/:username/places/:id", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .delete(
        "/users/u1/places/ChIJrxNRX7IFzkwR7RXdMeFRaoo"
      )
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      deleted: "Place: ChIJrxNRX7IFzkwR7RXdMeFRaoo",
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .delete(
        "/users/u1/places/ChIJrxNRX7IFzkwR7RXdMeFRaoo"
      )
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth if anon", async function () {
    const resp = await request(app).delete(
      "/users/u1/places/ChIJrxNRX7IFzkwR7RXdMeFRaoo"
    );
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such saved place for user", async function () {
    const resp = await request(app)
      .delete("/users/u1/places/no-such-place")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/*************************** POST /users/:username/places/:id/review */
describe("POST /users/:username/places/:id/review", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .post(
        "/users/u2/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/review"
      )
      .send({
        bathroom: true,
        changingTable: true,
        highchair: true,
        parking: true,
        otherNotes: "Lovely cafe",
        stars: 4,
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      added:
        "review for place: ChIJa2Q72ZIa0kwR7GMuasWj6IA",
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .post(
        "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/review"
      )
      .send({
        bathroom: true,
        changingTable: true,
        highchair: true,
        parking: true,
        otherNotes: "Lovely cafe",
        stars: 4,
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .post(
        "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/review"
      )
      .send({
        bathroom: true,
        changingTable: true,
        highchair: true,
        parking: true,
        otherNotes: "Lovely cafe",
        stars: 4,
      });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post(
        "/users/u2/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/review"
      )
      .send({
        bathroom: true,
        changingTable: true,
        highchair: true,
        parking: true,
        otherNotes: "Lovely cafe",
        stars: "four",
      })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************ DELETE /users/:username/places/:id/review */
describe("DELETE /users/:username/places/:id/review", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .delete(
        "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/review"
      )
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      deleted:
        "review for place: ChIJa2Q72ZIa0kwR7GMuasWj6IA",
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .delete(
        "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/review"
      )
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(
      "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/review"
    );
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no review for place by user", async function () {
    const resp = await request(app)
      .delete(
        "/users/u2/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/review"
      )
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/*************************** POST /users/:username/places/:id/date */
describe("POST /users/:username/places/:id/date", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .post(
        "/users/u2/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date"
      )
      .send({ timestamp: "2023-11-20 14:30:00" })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      Date: {
        who: "u2",
        where: "Equator Coffee Roasters",
        when: "2023-11-20T19:30:00.000Z",
      },
    });
  });

  test("unauth if other users", async function () {
    const resp = await request(app)
      .post(
        "/users/u2/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date"
      )
      .send({ timestamp: "2023-11-20 14:30:00" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth if anon", async function () {
    const resp = await request(app)
      .post(
        "/users/u2/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date"
      )
      .send({ timestamp: "2023-11-20 14:30:00" });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post(
        "/users/u2/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date"
      )
      .send({ timestamp: 2020 })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users/:username/dates */
describe("GET /users/:username/dates", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get("/users/u1/dates")
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      dates: [
        {
          name: "Equator Coffee Roasters",
          date: "2023-11-20 14:30:00",
          id: "ChIJa2Q72ZIa0kwR7GMuasWj6IA",
        },
      ],
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get("/users/u1/dates")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get("/users/u1/dates");
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no dates for user", async function () {
    const resp = await request(app)
      .get("/users/u2/dates")
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************** GET /users/:username/places/:id/date */
describe("GET /users/:username/places/:id/date", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .get(
        "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date"
      )
      .query({ timestamp: "2023-11-20 14:30:00" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      date: {
        where: "Equator Coffee Roasters",
        when: "2023-11-20 14:30:00",
      },
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .get(
        "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date"
      )
      .query({ timestamp: "2023-11-20 14:30:00" })
      .set("authorization", `Bearer ${u2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .get(
        "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date"
      )
      .query({ timestamp: "2023-11-20 14:30:00" });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no such date for user", async function () {
    const resp = await request(app)
      .get(
        "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date"
      )
      .query({ timestamp: "2024-11-20 14:30:00" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/******************************** GET /users/places/:id/dates */
describe("GET /users/places/:id/dates", function () {
  test("works for logged in user", async function () {
    const resp = await request(app)
      .get(
        "/users/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/dates"
      )
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.body).toEqual({
      dates: [
        {
          username: "u1",
          place: "Equator Coffee Roasters",
          date: "2023-11-20 14:30:00",
        },
      ],
    });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).get(
      "/users/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/dates"
    );
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if no dates at place", async function () {
    const resp = await request(app)
      .get(
        "/users/places/ChIJrxNRX7IFzkwR7RXdMeFRaoo/dates"
      )
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************** DELETE /users/:username/places/:id/date */
describe("DELETE /users/:username/places/:id/date", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .delete(
        "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date"
      )
      .send({ timestamp: "2023-11-20 14:30:00" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      Cancelled:
        "Date for u1 at ChIJa2Q72ZIa0kwR7GMuasWj6IA at 2023-11-20 14:30:00",
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
      .delete(
        "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date"
      )
      .send({ timestamp: "2023-11-20 14:30:00" })
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(
      "/users/u1/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date?timestamp=2023-11-20 14:30:00"
    );
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such date for user", async function () {
    const resp = await request(app)
      .delete(
        "/users/u3/places/ChIJa2Q72ZIa0kwR7GMuasWj6IA/date"
      )
      .send({ timestamp: "2023-11-20 14:30:00" })
      .set("authorization", `Bearer ${u3Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
