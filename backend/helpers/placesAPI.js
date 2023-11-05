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
  try {
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
  } catch (err) {
    console.log("insertion FAILED: ", err);
  }
}

async function googlePlacesAPICall(
  searchName,
  city,
  country
) {
  const term = searchName
    .replaceAll(" ", "%2C")
    .trim()
    .concat("%2C", `${city}`, "%2C", `${country}`);

  const result = await axios.get(
    `${GOOGLE_PLACES_API_BASE_URL}${term}&inputtype=textquery&key=${GOOGLE_API_KEY}`
  );
  // const result = await axios.get(
  //   `${GOOGLE_PLACES_API_BASE_URL}${term}&inputtype=textquery&location=${lat}%2C${lng}&radius=30000&key=${GOOGLE_API_KEY}`
  // );
  console.log("API results: ", result.data);
  if (result.data.candidates.length !== 0) {
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

  if (Object.keys(result.data.result).length !== 0) {
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
    `No search results found for ${id}`
  );
}

async function findPlace(searchName, city, country) {
  let placeInfo = await googlePlacesAPICall(
    searchName,
    city,
    country
  );

  let placeCheck = await db.query(
    `SELECT id, name, address, lat, lng, type
      FROM places
      WHERE id = $1`,
    [placeInfo.place_id]
  );

  let place = placeCheck.rows[0];

  if (!place) {
    let newPlace = await addPlace(placeInfo);
    newPlace.lat = +newPlace.lat;
    newPlace.lng = +newPlace.lng;

    return newPlace;
  }

  place.lat = +place.lat;
  place.lng = +place.lng;
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
