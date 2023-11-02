const axios = require("axios");

require("dotenv").config();

const db = require(`../../db`);
const {
  findPlace,
  findPlaceFromId,
} = require(`../../helpers/placesAPI`);
const { NotFoundError } = require(`../../expressError`);

jest.mock("axios");
// jest.mock("../../helpers/placesAPI", () => {
//   console.log("MOCKED addPlace fn is running???");
//   return {
//     ...jest.requireActual("../../helpers/placesAPI"),
//     addPlace: jest.fn().mockResolvedValue({
//       place_id: "sample_place_id",
//       name: "Sample Place",
//       address: "Sample Address",
//       lat: 42.123,
//       lng: -71.456,
//       type: "restaurant",
//     }),
//   };
// });

describe("findPlace", () => {
  it("should find a place by name", async () => {
    // Mock the axios.get method to return a sample response
    axios.get.mockResolvedValue({
      data: {
        candidates: [
          {
            name: "Sample Place",
            place_id: "sample_place_id",
            formatted_address: "Sample Address",
            geometry: {
              location: { lat: 42.123, lng: -71.456 },
            },
            types: ["restaurant"],
          },
        ],
      },
    });

    // Call findPlace function
    const result = await findPlace(
      "Sample Place",
      42.0,
      -71.5
    );

    expect(result).toEqual({
      place_id: "sample_place_id",
      name: "Sample Place",
      address: "Sample Address",
      lat: 42.123,
      lng: -71.456,
      type: "restaurant",
    });
  });

  it("should return an existing place from the database", async () => {
    // Mock the axios.get method to return a sample response
    axios.get.mockResolvedValue({
      data: {
        candidates: [
          {
            name: "Sample Place",
            place_id: "sample_place_id",
            formatted_address: "Sample Address",
            geometry: {
              location: { lat: 42.123, lng: -71.456 },
            },
            types: ["restaurant"],
          },
        ],
      },
    });

    // Mock the database query to return an existing place
    db.query = jest.fn().mockResolvedValue({
      rows: [
        {
          place_id: "sample_place_id",
          name: "Sample Place",
          address: "Sample Address",
          lat: 42.123,
          lng: -71.456,
          type: "restaurant",
        },
      ],
    });

    const result = await findPlace(
      "Sample Place",
      42.0,
      -71.5
    );

    expect(result).toEqual({
      place_id: "sample_place_id",
      name: "Sample Place",
      address: "Sample Address",
      lat: 42.123,
      lng: -71.456,
      type: "restaurant",
    });
  });

  it("should throw NotFoundError when no results are found", async () => {
    // Mock the axios.get method to simulate no results found
    axios.get.mockResolvedValue({
      data: {
        candidates: [],
      },
    });

    try {
      await findPlace("Nonexistent Place");
      fail("NotFoundError was not thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe(
        "No search results found for Nonexistent Place"
      );
    }
  });
});

describe("findPlaceFromId", () => {
  it("should find a place by ID", async () => {
    // Mock the axios.get method to return a sample response
    axios.get.mockResolvedValue({
      data: {
        result: {
          name: "Sample Place",
          place_id: "sample_place_id",
          formatted_address: "Sample Address",
          geometry: {
            location: { lat: 42.123, lng: -71.456 },
          },
          types: ["restaurant"],
        },
      },
    });

    // Call findPlace function
    const result = await findPlaceFromId("sample_place_id");

    console.log(
      "RESULT in findPlaceFromId in TEST file: ",
      result
    );

    expect(result).toEqual({
      place_id: "sample_place_id",
      name: "Sample Place",
      address: "Sample Address",
      lat: 42.123,
      lng: -71.456,
      type: "restaurant",
    });
  });

  it("should throw NotFoundError when no results are found", async () => {
    // Mock the axios.get method to return an empty candidates array
    axios.get.mockResolvedValue({
      data: {
        result: {},
      },
    });

    try {
      await findPlaceFromId("NonexistentPlaceId");
      // If no NotFoundError is thrown, fail the test
      fail("NotFoundError was not thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe(
        "No search results found for NonexistentPlaceId"
      );
    }
  });
});
