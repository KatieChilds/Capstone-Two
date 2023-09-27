"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";

const PORT = +process.env.PORT || 3001;

const GOOGLE_PLACES_API_BASE_URL =
  "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Ctypes%2Cgeometry%2Cplace_id&input=";

const GOOGLE_PLACES_DETAILS_API_BASE_URL =
  "https://maps.googleapis.com/maps/api/place/details/json?fields=formatted_address%2Cname%2Ctypes%2Cgeometry%2Cplace_id&place_id=";

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "playdate_buddy_test"
    : process.env.DATABASE_URL || "playdate_buddy";
}

// Speed up bcrypt during tests, since the algorithm safety isn't being tested
//
// WJB: Evaluate in 2021 if this should be increased to 13 for non-test use
const BCRYPT_WORK_FACTOR =
  process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  GOOGLE_PLACES_API_BASE_URL,
  GOOGLE_PLACES_DETAILS_API_BASE_URL,
};
