"use strict";

/** Routes for Authentication */

const jsonschema = require("jsonschema");

const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const {
  createToken,
  getWeavyAccessToken,
} = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userNewSchema = require("../schemas/userNew.json");
const { BadRequestError } = require("../expressError");

/** POST /auth/token : {username, password} => {token}
 * Takes in a username and password and generates a JWT token to be used in future authentication.
 */

router.post("/token", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(
      req.body,
      userAuthSchema
    );
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const { username, password } = req.body;
    const user = await User.authenticate(
      username,
      password
    );
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

/** POST /auth/register : {user} => {token}
 * user must include: username, password, firstName, lastName, email, city, country
 * Returns a JWT token for future authentication.
 */

router.post("/register", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(
      req.body,
      userNewSchema
    );
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const access_token = await getWeavyAccessToken(
      req.body.username
    );

    const newUser = await User.register({
      ...req.body,
      access_token,
    });

    const token = createToken(newUser);

    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
