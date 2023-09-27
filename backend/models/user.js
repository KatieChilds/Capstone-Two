"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  findPlace,
  findPlaceFromId,
} = require("../helpers/placesAPI");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/** Model class for User with related functions */
class User {
  // Checks for user and returns stored info, if user not found or password incorrect, returns UnauthorizedError.
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username,
                    password,
                    first_name AS firstName,
                    last_name AS lastName,
                    email,
                    city,
                    country,
                    token
            FROM users
            WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcrypt.compare(
        password,
        user.password
      );
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError(
      "Invalid username/password"
    );
  }

  //   Creates a new user and returns user info, throws BadRequestError if duplicate username is used.
  static async register({
    username,
    password,
    firstName,
    lastName,
    email,
    city,
    country,
    avatar,
    access_token,
  }) {
    const duplicateCheck = await db.query(
      `SELECT username
        FROM users
        WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(
        `Duplicate username: ${username}, please choose another username.`
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      BCRYPT_WORK_FACTOR
    );

    const result = await db.query(
      `INSERT INTO users
            (username,
                password,
                first_name,
                last_name,
                email,
                city,
                country,
                avatar,
                token)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING username, first_name AS "firstName", last_name AS "lastName", email, city, country, avatar, token AS access_token`,
      [
        username,
        hashedPassword,
        firstName,
        lastName,
        email,
        city,
        country,
        avatar,
        access_token,
      ]
    );

    const user = result.rows[0];
    return user;
  }

  /** Given a city and country, finds all local users.
   * Returns [{username, firstName}] */
  static async findLocal(
    city,
    country,
    { minAge, maxAge, gender } = {}
  ) {
    let query = `SELECT u.username, 
                u.first_name AS firstName, u.avatar
                FROM users AS u
                JOIN children AS c
                ON u.username = c.parent_username`;

    let whereExpressions = [];
    let queryValues = [];

    // For each possible search value, add to whereExpressions and queryValues in order to build correct SQL query.

    if (minAge !== undefined && maxAge !== undefined) {
      queryValues.push(minAge);
      queryValues.push(maxAge);
      whereExpressions.push(
        `age <= $${queryValues.length} AND age >= $${
          queryValues.length - 1
        } `
      );
    }

    if (gender !== undefined) {
      queryValues.push(gender);
      whereExpressions.push(
        `gender = $${queryValues.length}`
      );
    }

    queryValues.push(city);
    whereExpressions.push(`city = $${queryValues.length}`);
    queryValues.push(country);
    whereExpressions.push(
      `country = $${queryValues.length}`
    );

    query += " WHERE " + whereExpressions.join(" AND ");

    // Finalize query
    // query += " GROUP BY username";
    const results = await db.query(query, queryValues);
    return results.rows;
  }

  //   Given a username, return info for that user, including info about children: {age, gender}. Throws NotFoundError if user not found.
  static async get(username) {
    const userRes = await db.query(
      `SELECT username, first_name AS firstName, last_name AS lastName, email, city, country, avatar
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user)
      throw new NotFoundError(`No user: ${username}`);

    const userChildrenRes = await db.query(
      `SELECT age, gender
        FROM children
        WHERE parent_username = $1`,
      [username]
    );

    user.children = userChildrenRes.rows.map((c) => ({
      age: c.age,
      gender: c.gender,
    }));

    return user;
  }

  /** Given a username and data for the user, update the specified pieces of data. This will be a partial update where not all fields are required.
   * Fields can include: {password, firstName, lastName, email, city, country, avatar}
   * Returns: {firstName, lastName, email, city, country, avatar}
   * Throws NotFoundError if user not found
   */
  static async update(username, data) {
    if (data.password) {
      data.password = await bcrypt.hash(
        data.password,
        BCRYPT_WORK_FACTOR
      );
    }

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      city: "city",
      country: "country",
      avatar: "avatar",
    });

    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users
                      SET ${setCols}
                      WHERE username = ${usernameVarIdx}
                      RETURNING username,
                      first_name AS "firstName",
                      last_name AS "lastName",
                      email,
                      city,
                      country,
                      avatar`;

    const result = await db.query(querySql, [
      ...values,
      username,
    ]);
    const user = result.rows[0];

    if (!user)
      throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  // Given a username, delete the specified user from the database. Return undefined or throw NotFoundError if user not found.
  static async remove(username) {
    let result = await db.query(
      `DELETE FROM users
      WHERE username = $1
      RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user)
      throw new NotFoundError(`No user: ${username}`);
  }

  /** Given a username and data for a child add a child to the database.
   * Returns: list of child(ren) data, where data is age and gender.
   * Returns NotFoundError is user is not found.
   */
  static async addChild(username, data) {
    let userCheck = await db.query(
      `SELECT username
      FROM users
      WHERE username = $1`,
      [username]
    );

    const user = userCheck.rows[0];

    if (!user)
      throw new NotFoundError(`No user: ${username}`);

    await db.query(
      `INSERT INTO children
      (parent_username, age, gender)
      VALUES ($1, $2, $3)`,
      [username, data.age, data.gender]
    );

    const results = await db.query(
      `SELECT age, gender
      FROM children
      WHERE parent_username = $1`,
      [username]
    );

    const children = results.rows.map((c) => ({
      age: c.age,
      gender: c.gender,
    }));

    return children;
  }

  /** Update child information. Given a username and data make a partial update to the information of a user's child.
   * Returns undefined.
   * Returns NotFoundError if user or child is not found.
   */
  static async editChild(username, data) {
    const userCheck = await db.query(
      `SELECT username
    FROM users
    WHERE username = $1`,
      [username]
    );

    const user = userCheck.rows[0];
    if (!user)
      throw new NotFoundError(`No user: ${username}`);

    const { setCols, values } = sqlForPartialUpdate(data, {
      age: "age",
      gender: "gender",
    });

    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE children
                    SET ${setCols}
                    WHERE parent_username = ${usernameVarIdx}
                    RETURNING age, gender`;

    const result = await db.query(querySql, [
      ...values,
      username,
    ]);

    const child = result.rows[0];
    if (!child)
      throw new NotFoundError(
        `No children found for ${username}`
      );
  }

  /** Make a friend: update db, returns friend(s)
   * - user_friending: user initiating friendship
   * - user_friended: user being friended
   * returns: undefined
   * returns NotFoundError is user_friending or user_friended is not found. */
  static async addFriend(user_friending, user_friended) {
    let preCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`,
      [user_friending]
    );

    const user = preCheck.rows[0];
    if (!user)
      throw new NotFoundError(`No user: ${username}`);

    let preCheck2 = await db.query(
      `SELECT username
    FROM users
    WHERE username = $1`,
      [user_friended]
    );

    const user2 = preCheck2.rows[0];
    if (!user2)
      throw new NotFoundError(`No user: ${user_friended}`);

    await db.query(
      `INSERT INTO friends
      (user_friending_username, user_friended_username)
      VALUES ($1, $2)`,
      [user_friending, user_friended]
    );
  }

  /** Delete a friend from user's friends list and update database.
   * Returns: undefined or NotFoundError if user_friended or user_friending is not found.
   */
  static async removeFriend(user_friending, user_friended) {
    let result = await db.query(
      `DELETE FROM friends
        WHERE user_friending_username = $1
        AND user_friended_username = $2
        RETURNING user_friending_username`,
      [user_friending, user_friended]
    );

    const friendship = result.rows[0];

    if (!friendship)
      throw new NotFoundError(
        `No friendship between ${user_friending} and ${user_friended} found.`
      );
  }

  // Given a username, return list of friends. Returns NotFoundError if user not found.
  static async allFriends(username) {
    let preCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`,
      [username]
    );
    const user = preCheck.rows[0];
    if (!user)
      throw new NotFoundError(`No user: ${username}`);

    let results = await db.query(
      `SELECT user_friended_username
       FROM friends
       WHERE user_friending_username = $1`,
      [username]
    );

    const friends = results.rows.map(
      (f) => f.user_friended_username
    );

    return friends;
  }

  /** Given an id, return detailed info about a place stored in the database.
   * Returns: {id, name, address, type, reviews}
   *    where reviews is: [{user_username, content, stars},...]
   * Throws NotFoundError if place not found.
   */
  static async getPlace(id) {
    const result = await db.query(
      `SELECT name,
                address,
                type
        FROM places
        WHERE id = $1`,
      [id]
    );

    const place = result.rows[0];

    if (!place) throw new NotFoundError(`No place: ${id}`);

    const reviewsRes = await db.query(
      `SELECT username,
                bathroom,
                changing_table,
                highchair,
                parking,
                other_notes,
                stars,
                timestamp
        FROM reviews
        WHERE place_id = $1`,
      [id]
    );

    place.reviews = reviewsRes.rows.map((r) => ({
      user: r.username,
      content: {
        bathroom: r.bathroom,
        "changing table": r.changing_table,
        highchair: r.highchair,
        parking: r.parking,
        "other notes": r.other_notes,
      },
      stars: r.stars,
      date: r.timestamp,
    }));

    return place;
  }

  /** Given a username and id for a place save the place into the Users_places table of the db for the user. If the place is not already in the db, make a google places API call to get place info to add to db.
   * Returns undefined or NotFoundError if the user is not found.
   */
  static async savePlace(username, id) {
    let userCheck = await db.query(
      `SELECT username
      FROM users
      WHERE username = $1`,
      [username]
    );

    let user = userCheck.rows[0];
    if (!user)
      throw new NotFoundError(`No user: ${username}`);

    let placeCheck = await db.query(
      `SELECT id, name, address, lat, lng, type
      FROM places
      WHERE id = $1`,
      [id]
    );

    let place = placeCheck.rows[0];
    if (!place) {
      // If place not in database, make API call to Google Places API to get place info and save to database.
      await findPlaceFromId(id);
    }
    // If place is already in database for another user, add this place to the logged in user's saved places in the db.
    let duplicateCheck = await db.query(
      `SELECT username
      FROM users_places
      WHERE username = $1
      AND place_id = $2`,
      [username, id]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(
        `This place is already saved for ${username}.`
      );

    await db.query(
      `INSERT INTO users_places
      (username, place_id)
      VALUES ($1, $2)`,
      [username, id]
    );
  }

  /** Given a username and place_id remove the place from the users_places table in the database. Returns undefined or NotFoundError if place/user not found. */
  static async removeUserPlace(username, id) {
    let result = await db.query(
      `DELETE FROM users_places
      WHERE username = $1
      AND place_id = $2
      RETURNING place_id`,
      [username, id]
    );

    let place = result.rows[0];

    if (!place)
      throw new NotFoundError(
        `No saved place: ${id} for user: ${username}`
      );
  }

  /** Given a username and id for a place, logged in user can leave a review of the place.
   * Returns: undefined or throws NotFoundError if user is not found.
   */
  static async leaveReview(
    username,
    id,
    bathroom,
    changingTable,
    highchair,
    parking,
    otherNotes,
    stars
  ) {
    let userCheck = await db.query(
      `SELECT username
      FROM users
      WHERE username = $1`,
      [username]
    );

    let user = userCheck.rows[0];
    if (!user)
      throw new NotFoundError(`No user: ${username}`);

    await db.query(
      `INSERT INTO reviews
      (username, place_id, bathroom, changing_table, highchair, parking, other_notes, stars)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        username,
        id,
        bathroom,
        changingTable,
        highchair,
        parking,
        otherNotes,
        stars,
      ]
    );
  }

  /** Given a username and id for a place, logged in user can delete their review of a place.
   * Returns: undefined or throws NotFoundError if no review found for that given username/id.
   */
  static async removeReview(username, id) {
    let result = await db.query(
      `DELETE from reviews
      WHERE username = $1
      AND place_id = $2
      RETURNING user`,
      [username, id]
    );

    let review = result.rows[0];

    if (!review)
      throw new NotFoundError(
        `No review found by user: ${username} for place: ${id}`
      );
  }

  /** Given a username, id for a place and a timestamp add a new date to database for the user.
   * Returns: {newDate}
   * Throws BadRequestError if could not insert a new date into the db.
   */
  static async setDate(username, id, timestamp) {
    let result = await db.query(
      `INSERT INTO dates
      (username, place_id, date)
      VALUES ($1, $2, $3)
      RETURNING username, place_id, date`,
      [username, id, timestamp]
    );

    const newDate = result.rows[0];

    if (!newDate)
      throw BadRequestError(
        "Error setting date, please try again. Make sure all the information is correct."
      );

    let placeInfo = await db.query(
      `SELECT name
        FROM places
        WHERE id = $1`,
      [id]
    );

    newDate.place_id = placeInfo.rows[0].name;

    return newDate;
  }

  /** Given an id for a place, lists all dates scheduled for that place.
   * Returns: {dates}
   * Throws NotFoundError if the place_id is not found.
   */
  static async allDatesPlace(id) {
    let results = await db.query(
      `SELECT username, place_id, date FROM dates
      WHERE place_id = $1`,
      [id]
    );

    let placeInfo = await db.query(
      `SELECT name
        FROM places
        WHERE id = $1`,
      [id]
    );

    let place = placeInfo.rows[0].name;
    let dates = results.rows;
    if (!results.rows[0])
      throw new NotFoundError(
        `No dates found at place: ${place}`
      );

    let datesWithName = dates.map((d) => ({
      username: d.username,
      place,
      date: d.date,
    }));

    return datesWithName;
  }

  /** Given a user, place_id and timestamp, removes the scheduled date for the user.
   * Returns undefined.
   * Throws a NotFoundError if date is not found.
   */
  static async cancelDate(username, id, timestamp) {
    let result = await db.query(
      `DELETE FROM dates
      WHERE username = $1 AND
      place_id = $2 AND
      date = $3
      RETURNING user`,
      [username, id, timestamp]
    );

    if (!result.rows[0])
      throw new NotFoundError(
        `No date found for user: ${username} at place: ${id} at ${timestamp}`
      );
  }

  /** Given a username, lists all of the scheduled dates for a user.
   * Returns: {dates}
   * Throws NotFoundError if no dates found for user.
   */
  static async allDatesUser(username) {
    let dateResults = await db.query(
      `SELECT p.name, d.date 
      FROM places AS p
      JOIN dates AS d
      ON p.id = d.place_id
      WHERE username = $1`,
      [username]
    );

    let dates = dateResults.rows;
    if (!dates[0])
      throw new NotFoundError(
        `No dates found for user: ${username}`
      );

    return dates;
  }

  /** Given a username, place_id and timestamp, gives detailed info about a scheduled date.
   * Returns: {withUsers} where withUsers is an array of users who are scheduled for the same date as the given user.
   * Returns undefined if there are no other users with the same scheduled date.
   * Throws NotFoundError if there is no date found.
   */
  static async getDate(username, id, timestamp) {
    let results = await db.query(
      `SELECT username
      FROM dates
      WHERE place_id = $1 AND
      date = $2`,
      [id, timestamp]
    );

    let placeInfo = await db.query(
      `SELECT name
      FROM places
      WHERE id = $1`,
      [id]
    );

    const place = placeInfo.rows[0].name;

    if (!results.rows[0])
      throw new NotFoundError(
        `No date found for user: ${username}, at place: ${place} at ${timestamp}`
      );

    const withUsers = results.rows.filter(
      (u) => u.username !== username
    );

    if (withUsers.length !== 0) {
      return {
        where: `${place}`,
        when: `${timestamp}`,
        with: `${withUsers}`,
      };
    } else {
      return {
        where: `${place}`,
        when: `${timestamp}`,
      };
    }
  }
}

module.exports = User;
