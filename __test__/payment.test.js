const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");

let verifiedToken;
let unverifiedToken;
beforeAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });

  let data = [
    {
      fullName: "Aliansyah Firdaus",
      email: "aliansyah@mail.com",
      password: "admin",
      isVerified: true,
      verificationCode: "d0847",
      status: false,
      isPremium: false,
    },
    {
      fullName: "Fitrah Ananda",
      email: "fitrah@mail.com",
      password: "admin",
      isVerified: false,
      verificationCode: "bdf70",
      status: false,
      isPremium: false,
    },
  ];

  const users = await User.bulkCreate(data);

  verifiedToken = generateToken({
    id: users[0].id,
    email: users[0].email,
  });

  unverifiedToken = generateToken({
    id: users[1].id,
    email: users[1].email,
  });

  verifiedStatus = users[0].isVerified;
  unverifiedStatus = users[1].isVerified;
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
});

describe("Payment routes test", () => {
  describe("POST /payment", () => {
    test("should return status code 200 - should user payment succeeded", async () => {
      const response = await request(app)
        .post("/payment")
        .set("access_token", verifiedToken)
        .expect(200);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("token", expect.any(String));
      expect(response.body).toHaveProperty("redirect_url");
      expect(response.body).toHaveProperty("redirect_url", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return status code 401 - should user payment failed due unverified email", async () => {
      const response = await request(app)
        .post("/payment")
        .set("access_token", unverifiedToken)
        .expect(403);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return status code 500 - should user payment failed", async () => {
      const response = await request(app)
        .post("/payment")
        .set("access_token", verifiedToken)
        .send({
          error: "error",
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });
  });
});
