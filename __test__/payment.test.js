const request = require("supertest");
const { app } = require("../app");
const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");

let validToken;
let verificationCode;
let invalidToken = "w1800j1hh10wj0jd10jw901jdj";
beforeAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });

  // const newUser = await User.create({
  //   fullName: "Diaz Linggaputra",
  //   email: "diaz@mail.com",
  //   password: "admin",
  // });

  const newUser = await User.create({
    fullName: "Admin Sitompul",
    email: "admin@mail.com",
    password: "admin",
  });

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
      isVerified: true,
      verificationCode: "bdf70",
      status: false,
      isPremium: false,
    },
  ];

  await User.bulkCreate(data);

  validToken = generateToken({
    id: newUser.id,
    email: newUser.email,
  });
  verificationCode = newUser.verificationCode;
});

afterAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });
});

describe("Payment routes test", () => {
  describe("POST /payment", () => {
    test("Should return status code 401 if token is invalid", async () => {
      const response = await request(app)
        .post("/payment")
        .set("Authorization", `Bearer ${invalidToken}`);
      expect(response.status).toBe(401);
    });
  });
});
