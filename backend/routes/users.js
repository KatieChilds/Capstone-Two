"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const {
  ensureCorrectUser,
  ensureLoggedIn,
} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const userUpdateSchema = require("../schemas/userUpdate.json");
const newChildSchema = require("../schemas/newChildSchema.json");
const reviewNew = require("../schemas/reviewNew.json");
const dateNew = require("../schemas/dateNew.json");
const { findPlace } = require("../helpers/placesAPI");

const router = express.Router();

/** GET / => {users: [{username, firstName, avatar}, ...]}
 * Returns: list of users
 * Authorization required: logged in user
 */
router.get(
  "/",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      let q = req.query;
      if (q.minAge !== undefined) q.minAge = +q.minAge;
      if (q.maxAge !== undefined) q.maxAge = +q.maxAge;
      const users = await User.findUsers(q);
      return res.json({ users });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username] => {user}
 * Returns: {username, firstName, lastName, email, city, country, avatar, children}
 *      where children is {age, gender}
 * Authorization required: same user as username
 */
router.get(
  "/:username",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/** PATCH /[username] {user} => {user}
 * Data can include: {password, firstName, lastName, email, city, country, avatar}
 * Returns: {username, firstName, lastName, email, city, country, avatar}
 * Authorization required: same user as username
 */
router.patch(
  "/:username",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      console.log(
        "REQ BODY from users patch route",
        req.body
      );
      const validator = jsonschema.validate(
        req.body,
        userUpdateSchema
      );
      console.log(
        "VALIDATOR.valid from users patch route",
        validator.valid
      );
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        console.log(
          "ERRS in patch update users route",
          errs
        );
        throw new BadRequestError(errs);
      }

      const user = await User.update(
        req.params.username,
        req.body
      );

      return res.json({ user });
    } catch (err) {
      return next;
    }
  }
);

/** DELETE /[username] => {deleted: username}
 * Authorization required: same user as username
 */
router.delete(
  "/:username",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /[username]/children/add => [children: {age, gender}, ...]
 * Returns: list of logged in user's children
 * Authorization: same user as username
 */
router.post(
  "/:username/children/add",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(
        req.body,
        newChildSchema
      );

      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const children = await User.addChild(
        req.params.username,
        req.body
      );
      return res.status(201).json({ children });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /[username]/friends/[user_friended]/add {friend} =>
 * {friended: user_friended}
 * Authorization required: same user as username
 */
router.post(
  "/:username/friends/:user_friended/add",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      await User.addFriend(
        req.params.username,
        req.params.user_friended
      );
      return res.status(201).json({
        friended: req.params.user_friended,
      });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]/friends => {friends: [{user_friended}, ...]}
 * Returns: list of logged in user's friends
 * Authorization required: same user as username
 */
router.get(
  "/:username/friends",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const friends = await User.allFriends(
        req.params.username
      );
      return res.json({ friends });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]/friends/[user_friended]/remove =>
 * {unfriended: user_friended}
 * Authorization required: same user as username
 */
router.delete(
  "/:username/friends/:user_friended/remove",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      await User.removeFriend(
        req.params.username,
        req.params.user_friended
      );
      return res.json({
        unfriended: req.params.user_friended,
      });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /place => {places: [{place_id, name, address, type}, ...]}
 * Returns: Top place matching search term from Google Places API. Adds top matching place to database.
 * Authorization required: logged in user
 */
router.post(
  "/place/search",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const { searchName, city, country } = req.body;
      const place = await findPlace(
        searchName,
        city,
        country
      );
      return res.json({ place });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /places/[id] => {place}
 * Returns: {name, address, type, reviews}
 *    where reviews is: [{username, bathroom, changingTable, highchair, parking, otherNotes, stars},...]
 * Authorization required: logged in user
 */
router.get(
  "/places/:id",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const place = await User.getPlace(req.params.id);
      return res.json({ place });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /[username]/places/[id] =>
 * Returns: {Saved: Place:id}
 * Authorization required: same user as username
 */
router.post(
  "/:username/places/:id",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      await User.savePlace(
        req.params.username,
        req.params.id
      );
      return res
        .status(201)
        .json({ Saved: `Place: ${req.params.id}` });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]/places =>
 * Returns: {places}
 * Authorization: same user as username
 */
router.get(
  "/:username/places",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const places = await User.getUserPlaces(
        req.params.username
      );
      return res.json({ places });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]/places/:id => {deleted: {place}}
 * Authorization required: same user as username
 */
router.delete(
  "/:username/places/:id",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      await User.removeUserPlace(
        req.params.username,
        req.params.id
      );
      return res.json({
        deleted: `Place: ${req.params.id}`,
      });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /[username]/places/[id]/review
 * Returns: {added: review for place:id}
 * Authorization required: same user as username
 */
router.post(
  "/:username/places/:id/review",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(
        req.body,
        reviewNew
      );

      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const { username, id } = req.params;
      const {
        bathroom,
        changingTable,
        highchair,
        parking,
        otherNotes,
        stars,
      } = req.body;
      await User.leaveReview(
        username,
        id,
        bathroom,
        changingTable,
        highchair,
        parking,
        otherNotes,
        stars
      );
      return res
        .status(201)
        .json({ added: `review for place: ${id}` });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]/places/[id]/review
 * Returns: {deleted: review for place:id}
 * Authorization required: same user as username
 */
router.delete(
  "/:username/places/:id/review",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      await User.removeReview(
        req.params.username,
        req.params.id
      );
      return res.json({
        deleted: `review for place: ${req.params.id}`,
      });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /[username]/places/:id/date
 * Returns: {Date: {who, where, when}}
 * Authorization required: same user as username
 */
router.post(
  "/:username/places/:id/date",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(
        req.body,
        dateNew
      );
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const { username, id } = req.params;
      const { timestamp } = req.body;
      const date = await User.setDate(
        username,
        id,
        timestamp
      );

      return res.status(201).json({
        Date: {
          who: date.username,
          where: date.place_id,
          when: date.date,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]/dates
 * Returns: List of logged in user's scheduled dates from db.
 * Authorization required: same user as username
 */
router.get(
  "/:username/dates",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const username = req.params.username;
      const dates = await User.allDatesUser(username);
      return res.json({ dates });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]/places/[id]/date
 * Returns: Detailed info about a date for a user based on place id and timestamp.
 * Authorization: same user as username
 */
router.get(
  "/:username/places/:id/date",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const { username, id } = req.params;
      const { timestamp } = req.query;
      const date = await User.getDate(
        username,
        id,
        timestamp
      );
      return res.json({ date });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /places/[id]/dates
 * Returns: List of scheduled dates from db for a given place.
 * Authorization required: logged in user
 */
router.get(
  "/places/:id/dates",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      const id = req.params.id;
      const dates = await User.allDatesPlace(id);
      return res.json({ dates });
    } catch (err) {
      return next(err);
    }
  }
);

/** DELETE /[username]/places/[id]/date
 * Returns:
 * Authorization required: same user as username
 */
router.delete(
  "/:username/places/:id/date",
  ensureCorrectUser,
  async function (req, res, next) {
    try {
      const { username, id } = req.params;
      const { timestamp } = req.body;
      await User.cancelDate(username, id, timestamp);
      return res.json({
        Cancelled: `Date for ${username} at ${id} at ${timestamp}`,
      });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
