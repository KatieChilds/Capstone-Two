const jwt = require("jsonwebtoken");
const axios = require("axios");

const {
  createToken,
  getWeavyAccessToken,
} = require(`../../helpers/tokens`);
const { NotFoundError } = require(`../../expressError`);
const { SECRET_KEY } = require(`../../config`);

// // Mocking the getWeavyAccessToken function
// jest.mock(`../../helpers/tokens`, () => ({
//   getWeavyAccessToken: jest.fn(),
// }));

describe("createToken", function () {
  test("works: all info provided", function () {
    const user = {
      username: "u1",
      lat: 123,
      lng: 456,
      access_token: "mocked-access-token",
    };
    const token = createToken(user);
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "u1",
      lat: 123,
      lng: 456,
      access_token: "mocked-access-token",
    });
  });

  test("works: without access_token provided", function () {
    const user = {
      username: "u1",
      lat: 123,
      lng: 456,
      access_token: null,
    };
    const token = createToken(user);
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "u1",
      lat: 123,
      lng: 456,
      access_token: null,
    });
  });
});

// Mock the axios.post function
jest.mock("axios");

describe("getWeavyAccessToken", () => {
  it("should return a valid Weavy access token", async () => {
    // Mock the Axios.post function to return a specific response
    axios.post.mockResolvedValue({
      data: {
        access_token: "mocked-weavy-access-token",
      },
    });

    const user = "u1";
    const token = await getWeavyAccessToken(user);

    // Assert that the function returned the expected value
    expect(token).toEqual("mocked-weavy-access-token");
  });

  it("should handle errors gracefully", async () => {
    // Mock Axios.post to simulate an error response
    axios.post.mockRejectedValue(
      new NotFoundError("Simulated error")
    );

    const user = "u1";

    // Ensure that the function handles errors
    try {
      await getWeavyAccessToken(user);
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe("Simulated error");
    }
  });
});
