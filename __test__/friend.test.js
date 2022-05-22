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

describe("Friend routes test", () => {
  describe("POST /friends", () => {
    test("should return status code 201 - should user send friend request", async () => {
      const response = await request(app)
        .post("/friends")
        .set("access_token", validToken)
        .send({
          friendId: 2,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("friend", expect.any(Object));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return status code 400 - should user send duplicate friend request", async () => {
      const response = await request(app)
        .post("/friends")
        .set("access_token", validToken)
        .send({
          friendId: 2,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return status code 400 - should send friend request but encounter bad request", async () => {
      const response = await request(app)
        .post("/friends")
        .set("access_token", validToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return status code 400 and friend id is not found", async () => {
      const response = await request(app)
        .post("/friends")
        .set("access_token", validToken)
        .send({
          friendId: 100,
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("GET /friends", () => {
    test("should return status code 200 - should get friend list", async () => {
      const response = await request(app)
        .get("/friends")
        .set("access_token", validToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("friendList", expect.any(Array));
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("GET /friends/request", () => {
    test("should return status code 200 - should get friend request list", async () => {
      const response = await request(app)
        .get("/friends/request")
        .set("access_token", validToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty(
        "friendRequestList",
        expect.any(Array)
      );
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("PATCH /friends/:friendId", () => {
    test("should return status code 200 - should accept friend request", async () => {
      const response = await request(app)
        .patch(`/friends/${2}`)
        .set("access_token", validToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return status code 404 - should accept friend request but friend id is not found", async () => {
      const response = await request(app)
        .patch(`/friends/${100}`)
        .set("access_token", validToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("DELETE /friends/request/:friendId", () => {
    test("should return status code 200 - should delete friend request", async () => {
      const response = await request(app)
        .delete(`/friends/request/${2}`)
        .set("access_token", validToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return status code 404 - should delete friend request but friend id is not found", async () => {
      const response = await request(app)
        .delete(`/friends/request/${100}`)
        .set("access_token", validToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("DELETE /friends/:friendId", () => {
    test("should return status code 200 - should delete friend", async () => {
      const response = await request(app)
        .delete(`/friends/${2}`)
        .set("access_token", validToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return status code 400 - should delete friend but friend id is not found", async () => {
      const response = await request(app)
        .delete(`/friends/${100}`)
        .set("access_token", validToken);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });
  });
});
