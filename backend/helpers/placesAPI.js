const {
  GOOGLE_PLACES_API_BASE_URL,
  GOOGLE_PLACES_DETAILS_API_BASE_URL,
} = require("../config.js");
require("dotenv").config();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const { NotFoundError } = require("../expressError.js");
const axios = require("axios");
const db = require("../db.js");

async function addPlace(place) {
  let newPlace = await db.query(
    `INSERT INTO places
          (id, name, address, lat, lng, type)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id, name, address, lat, lng, type`,
    [
      place.place_id,
      place.name,
      place.address,
      place.lat,
      place.lng,
      place.type,
    ]
  );
  return newPlace.rows[0];
}

async function googlePlacesAPICall(searchName) {
  console.log("PLACES API SEARCHNAME", searchName);
  const term = searchName.replaceAll(" ", "%2C").trim();
  console.log("TERM", term);
  const result = await axios.get(
    `${GOOGLE_PLACES_API_BASE_URL}${term}&inputtype=textquery&key=${GOOGLE_API_KEY}`
  );
  if (result.data.candidates != []) {
    const { name, place_id, formatted_address } =
      result.data.candidates[0];
    const { lat, lng } =
      result.data.candidates[0].geometry.location;
    const type = result.data.candidates[0].types[0];
    const place = {
      place_id,
      name,
      address: formatted_address,
      lat,
      lng,
      type,
    };

    return place;
  }
  throw new NotFoundError(
    `No search results found for ${searchName}`
  );
}

async function googlePlaceDetailsAPICall(id) {
  const result = await axios.get(
    `${GOOGLE_PLACES_DETAILS_API_BASE_URL}${id}&key=${GOOGLE_API_KEY}`
  );

  if (result.data.result != {}) {
    const { name, place_id, formatted_address } =
      result.data.result;
    const { lat, lng } =
      result.data.result.geometry.location;
    const type = result.data.result.types[0];
    const place = {
      place_id,
      name,
      address: formatted_address,
      lat,
      lng,
      type,
    };

    return place;
  }
  throw new NotFoundError(
    `No search results found for ${searchName}`
  );
}

async function findPlace(searchName) {
  console.log(searchName);
  let placeInfo = await googlePlacesAPICall(searchName);

  let placeCheck = await db.query(
    `SELECT id, name, address, lat, lng, type
      FROM places
      WHERE id = $1`,
    [placeInfo.place_id]
  );

  let place = placeCheck.rows[0];
  if (!place) {
    let newPlace = await addPlace(placeInfo);
    return newPlace;
  }
  return place;
}

async function findPlaceFromId(id) {
  let placeInfo = await googlePlaceDetailsAPICall(id);

  let placeCheck = await db.query(
    `SELECT id, name, address, lat, lng, type
          FROM places
          WHERE id = $1`,
    [id]
  );

  let place = placeCheck.rows[0];
  if (!place) {
    let newPlace = await addPlace(placeInfo);
    return newPlace;
  }
  return place;
}

module.exports = { findPlace, findPlaceFromId };
