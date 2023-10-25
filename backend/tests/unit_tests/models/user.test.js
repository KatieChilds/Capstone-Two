"use strict";
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require(`../../../expressError`);
const db = require(`../../../db`);
const User = require(`../../../models/user`);
const {
  findPlace,
  findPlaceFromId,
  addPlace,
} = require(`../../../helpers/placesAPI`);
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const { DatabaseError } = require("pg");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// Mock findPlace and findPlaceFromId
jest.mock("../../../helpers/placesAPI", () => {
  const originalModule = jest.requireActual(
    "../../../helpers/placesAPI"
  );
  const db = require(`../../../db`);
  return {
    ...originalModule,
    findPlace: (searchName) => {
      if (searchName === "new place") {
        return { lat: 234, lng: 567 };
      } else if (searchName === "city country") {
        return { lat: 123, lng: 456 };
      } else {
        throw new Error("Invalid input");
      }
    },
    findPlaceFromId: async (id) => {
      const placeInfo = {
        place_id: id,
        name: "new place",
        address: "123 new street",
        lat: 123,
        lng: 456,
        type: "place",
      };
      await originalModule.addPlace(placeInfo);
    },
  };
});

/************************************** authenticate */
describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate(
      "u1",
      "u1password"
    );
    expect(user).toEqual({
      username: "u1",
      firstname: "user",
      lastname: "one",
      email: "u1@email.com",
      lat: 123,
      lng: 456,
      token: null,
    });
  });

  test("unauth if no such user", async function () {
    try {
      await User.authenticate("nope", "password");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("u1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });
});

/************************************** register */
describe("register", function () {
  test("works", async function () {
    let newUser = {
      username: "new",
      firstname: "new",
      lastname: "user",
      email: "test@test.com",
      city: "city",
      country: "country",
      avatar: "user_default_avatar.png",
      token: null,
    };
    let user = await User.register({
      ...newUser,
      password: "password",
    });
    delete newUser.city;
    delete newUser.country;
    delete newUser.token;
    (newUser.lat = 123), (newUser.lng = 456);
    newUser.access_token = null;
    expect(user).toEqual(newUser);
    const found = await db.query(
      "SELECT * FROM users WHERE username = 'new'"
    );

    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].username).toEqual("new");
    expect(
      found.rows[0].password.startsWith("$2b$")
    ).toEqual(true);
  });

  test("bad request with dup data", async function () {
    try {
      let newUser = {
        username: "new",
        firstname: "new",
        lastname: "user",
        email: "test@test.com",
        city: "city",
        country: "country",
        avatar: "user_default_avatar.png",
        token: null,
      };
      await User.register({
        ...newUser,
        password: "password",
      });
      await User.register({
        ...newUser,
        password: "password",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findUsers */
describe("findUsers", function () {
  test("works", async function () {
    const users = await User.findUsers();
    expect(users).toEqual(
      expect.arrayContaining([
        {
          username: "u1",
          firstname: "user",
          avatar: "user_default_avatar.png",
        },
        {
          username: "u2",
          firstname: "user",
          avatar: "user_default_avatar.png",
        },
        {
          username: "u3",
          firstname: "user",
          avatar: "user_default_avatar.png",
        },
      ])
    );
  });
});

/************************************** get */
describe("get", function () {
  test("works for user with children", async function () {
    let user = await User.get("u1");
    expect(user).toEqual({
      username: "u1",
      firstname: "user",
      lastname: "one",
      email: "u1@email.com",
      lat: 123,
      lng: 456,
      avatar: "user_default_avatar.png",
      children: [{ age: "3 years", gender: "male" }],
    });
  });

  test("works for user without children", async function () {
    let user = await User.get("u2");
    expect(user).toEqual({
      username: "u2",
      firstname: "user",
      lastname: "two",
      email: "u2@email.com",
      lat: 123,
      lng: 456,
      avatar: "user_default_avatar.png",
      children: [],
    });
  });

  test("not found if no such user", async function () {
    try {
      await User.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */
describe("update", function () {
  const updateData = {
    firstname: "new",
    lastname: "user",
    email: "new@email.com",
    avatar: "new_user_avatar.png",
  };

  test("works to update not including location with children", async function () {
    let newUser = await User.update("u1", updateData);
    expect(newUser).toEqual({
      username: "u1",
      lat: 123,
      lng: 456,
      ...updateData,
      children: [{ age: "3 years", gender: "male" }],
    });
  });

  test("works to update not including location without children", async function () {
    let newUser = await User.update("u2", updateData);
    expect(newUser).toEqual({
      username: "u2",
      lat: 123,
      lng: 456,
      ...updateData,
      children: [],
    });
  });

  test("works to update location", async function () {
    const data = {
      city: "new",
      country: "place",
    };
    let newUser = await User.update("u2", data);
    expect(newUser).toEqual({
      username: "u2",
      firstname: "user",
      lastname: "two",
      email: "u2@email.com",
      lat: 234,
      lng: 567,
      avatar: "user_default_avatar.png",
      children: [],
    });
  });

  test("works: set password", async function () {
    let newUser = await User.update("u1", {
      password: "new",
    });
    expect(newUser).toEqual({
      username: "u1",
      firstname: "user",
      lastname: "one",
      email: "u1@email.com",
      lat: 123,
      lng: 456,
      avatar: "user_default_avatar.png",
      children: [{ age: "3 years", gender: "male" }],
    });
    const found = await db.query(
      "SELECT * FROM users WHERE username = 'u1'"
    );
    expect(found.rows.length).toEqual(1);
    expect(
      found.rows[0].password.startsWith("$2b$")
    ).toEqual(true);
  });

  test("not found if no such user", async function () {
    try {
      await User.update("nope", {
        firstname: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("u1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */
describe("remove", function () {
  test("works", async function () {
    await User.remove("u1");
    const res = await db.query(
      "SELECT * FROM users WHERE username='u1'"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** addChild */
describe("addChild", function () {
  const newChild = {
    dob: "2021-11-20",
    gender: "female",
  };

  test("works", async function () {
    const children = await User.addChild("u1", newChild);
    expect(children).toEqual([
      { age: "3 years old", gender: "male" },
      { age: "2 years old", gender: "female" },
    ]);
  });

  test("database error if data missing", async function () {
    expect.assertions(1);
    try {
      await User.addChild("u1", {});
      fail();
    } catch (err) {
      expect(err.constructor.name).toBe("DatabaseError");
    }
  });

  test("not found if no such user", async function () {
    try {
      await User.addChild("nope", newChild);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** addFriend */
describe("addFriend", function () {
  test("works", async function () {
    await User.addFriend("u1", "u3");
    const res = await db.query(
      `SELECT * FROM friends WHERE user_friended_username = 'u3'`
    );
    expect(res.rows.length).toEqual(1);
    expect(res.rows[0].user_friending_username).toEqual(
      "u1"
    );
    expect(res.rows[0].user_friended_username).toEqual(
      "u3"
    );
  });

  test("not found if no such friending user", async function () {
    expect.assertions(1);
    try {
      await User.addFriend("nope", "u1");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("not found if no such friended user", async function () {
    expect.assertions(1);
    try {
      await User.addFriend("u1", "nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** removeFriend */
describe("removeFriend", function () {
  test("works", async function () {
    await User.removeFriend("u1", "u2");
    const res = await db.query(
      `SELECT * FROM friends WHERE user_friending_username = 'u1'`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such friendship", async function () {
    try {
      await User.removeFriend("u2", "u3");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** allFriends */
describe("allFriends", function () {
  test("works", async function () {
    const friends = await User.allFriends("u1");
    expect(friends.length).toEqual(1);
    expect(friends).toEqual(["u2"]);
  });

  test("not found if no such user", async function () {
    try {
      await User.allFriends("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** getPlace */
describe("getPlace", function () {
  test("works", async function () {
    const place = await User.getPlace("abc123");
    expect(place.name).toEqual("test-place");
    expect(place.address).toEqual("123 main street");
    expect(place.reviews).toEqual([]);
  });

  test("not found if no such place", async function () {
    try {
      await User.getPlace("noSuchPlace");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** savePlace */
describe("savePlace", function () {
  test("works for place in db", async function () {
    await User.savePlace("u1", "abc123");
    const res = await db.query(
      `SELECT * FROM users_places WHERE username = 'u1'`
    );
    expect(res.rows.length).toEqual(1);
  });

  test("works for new place", async function () {
    await User.savePlace("u1", "newPlace");
    const res = await db.query(
      `SELECT * FROM users_places WHERE username = 'u1'`
    );
    expect(res.rows.length).toEqual(1);
    expect(res.rows[0].place_id).toEqual("newPlace");
  });

  test("bad request if place already saved for user", async function () {
    try {
      await User.savePlace("u1", "abc123");
      await User.savePlace("u1", "abc123");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("not found if no such user", async function () {
    try {
      await User.savePlace("nope", "abc123");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** getUserPlaces */
describe("getUserPlaces", function () {
  test("works", async function () {
    await User.savePlace("u1", "abc123");
    const places = await User.getUserPlaces("u1");
    expect(places.length).toEqual(1);
    expect(places[0].name).toEqual("test-place");
  });

  test("not found if no such user", async function () {
    await User.savePlace("u1", "abc123");
    try {
      await User.getUserPlaces("nope", "abc123");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("not found if no saved places", async function () {
    try {
      await User.getUserPlaces("u1", "abc123");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** removeUserPlace */
describe("removeUserPlace", function () {
  test("works", async function () {
    await User.savePlace("u1", "abc123");
    await User.removeUserPlace("u1", "abc123");
    const res = await db.query(
      `SELECT * FROM users_places WHERE username = 'u1'`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such saved place for user", async function () {
    try {
      await User.removeUserPlace("u1", "abc123");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** leaveReview */
describe("leaveReview", function () {
  test("works", async function () {
    await User.leaveReview(
      "u1",
      "abc123",
      true,
      true,
      true,
      true,
      "good place",
      3
    );
    const res = await db.query(
      `SELECT * FROM reviews WHERE username = 'u1'`
    );
    expect(res.rows.length).toEqual(1);
    expect(res.rows[0].place_id).toEqual("abc123");
    expect(res.rows[0].stars).toEqual(3);
  });

  test("not found if no such user", async function () {
    try {
      await User.leaveReview(
        "nope",
        "abc123",
        true,
        true,
        true,
        true,
        "good place",
        3
      );
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("database error if stars not included", async function () {
    expect.assertions(1);
    try {
      await User.leaveReview(
        "u1",
        "abc123",
        true,
        true,
        true,
        true,
        "good place"
      );
      fail();
    } catch (err) {
      expect(err.constructor.name).toBe("DatabaseError");
    }
  });
});

/************************************** removeReview */
describe("removeReview", function () {
  test("works", async function () {
    await User.leaveReview(
      "u1",
      "abc123",
      true,
      true,
      true,
      true,
      "good place",
      3
    );
    await User.removeReview("u1", "abc123");
    const res = await db.query(
      `SELECT * FROM reviews WHERE username = 'u1'`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no reviews for place by user", async function () {
    await User.leaveReview(
      "u1",
      "abc123",
      true,
      true,
      true,
      true,
      "good place",
      3
    );
    try {
      await User.removeReview("u2", "abc123");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** setDate */
describe("setDate", function () {
  test("works", async function () {
    const date = await User.setDate(
      "u1",
      "abc123",
      "2023-12-30 09:00:00"
    );
    expect(date.username).toEqual("u1");
    expect(date.place_id).toEqual("test-place");
    expect(date.date).toEqual(expect.anything());
  });

  test("database error if timestamp missing", async function () {
    try {
      await User.setDate("u1", "abc123");
      fail();
    } catch (err) {
      expect(err.constructor.name).toBe("DatabaseError");
    }
  });
});

/************************************** allDatesPlace */
describe("allDatesPlace", function () {
  test("works", async function () {
    await User.setDate(
      "u1",
      "abc123",
      "2023-12-30 09:00:00"
    );
    const dates = await User.allDatesPlace("abc123");
    expect(dates.length).toEqual(1);
    expect(dates[0].username).toEqual("u1");
    expect(dates[0].date).toEqual("2023-12-30 09:00:00");
  });

  test("not found if no dates", async function () {
    try {
      await User.allDatesPlace("abc123");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** cancelDate */
describe("cancelDate", function () {
  test("works", async function () {
    await User.setDate(
      "u1",
      "abc123",
      "2023-12-30 09:00:00"
    );
    await User.cancelDate(
      "u1",
      "abc123",
      "2023-12-30 09:00:00"
    );
    const res = await db.query(
      `SELECT * FROM dates WHERE username = 'u1'`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such date", async function () {
    try {
      await User.cancelDate(
        "u1",
        "abc123",
        "2023-12-30 09:00:00"
      );
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** allDatesUser */
describe("allDatesUser", function () {
  test("works", async function () {
    await User.setDate(
      "u1",
      "abc123",
      "2023-12-30 09:00:00"
    );
    const dates = await User.allDatesUser("u1");
    expect(dates.length).toEqual(1);
    expect(dates[0].name).toEqual("test-place");
    expect(dates[0].date).toEqual("2023-12-30 09:00:00");
  });

  test("not found if no dates for user", async function () {
    try {
      await User.allDatesUser("u1");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** getDate */
describe("getDate", function () {
  test("works for when and where", async function () {
    await User.setDate(
      "u1",
      "abc123",
      "2023-12-30 09:00:00"
    );
    const res = await User.getDate(
      "u1",
      "abc123",
      "2023-12-30 09:00:00"
    );
    expect(res.where).toEqual("test-place");
    expect(res.when).toEqual("2023-12-30 09:00:00");
  });

  test("works for when, where and with", async function () {
    await User.setDate(
      "u1",
      "abc123",
      "2023-12-30 09:00:00"
    );
    await User.setDate(
      "u2",
      "abc123",
      "2023-12-30 09:00:00"
    );
    const res = await User.getDate(
      "u1",
      "abc123",
      "2023-12-30 09:00:00"
    );
    expect(res.where).toEqual("test-place");
    expect(res.when).toEqual("2023-12-30 09:00:00");
    expect(res.with).toEqual([{ username: "u2" }]);
  });

  test("not found if no such date", async function () {
    try {
      await User.getDate(
        "u1",
        "abc123",
        "2023-12-30 09:00:00"
      );
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
