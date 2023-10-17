"use strict";

/** Convenience middleware to handle common auth cases in routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals (this will include the username, city and country fields.)
 *
 * It's not an error if no token was provided or if the token is not valid.
 */

function authenticateJWT(req, res, next) {
  try {
    const authHeader =
      req.headers && req.headers.authorization;
    if (authHeader) {
      const token = authHeader
        .replace(/^[Bb]earer /, "")
        .trim();
      console.log("AUTH mid TOKEN", token);
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }
    console.log("RES LOCALS USER", res.locals.user);
    console.log("AUTH HEADER", authHeader);
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware to use when they must be logged in.
 *
 * If not, raises Unauthorized.
 */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) throw new UnauthorizedError();
    return next();
  } catch (err) {
    return next(err);
  }
}

/** Middleware to use when they must provide a valid token & be user matching username provided as route param.
 *
 *  If not, raises Unauthorized.
 */

function ensureCorrectUser(req, res, next) {
  try {
    const user = res.locals.user;
    console.log("USER?", user);
    if (!(user && user.username === req.params.username)) {
      throw new UnauthorizedError();
    }
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
};
