const request = require("supertest");
const { app } = require("../app");
const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");

const { MongoClient, ObjectId } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const db = client.db("ranchat");

let validToken;
let verificationCode;
let dummyData;
let newRoomId;
let dummySocketId = "waufhsnd19h1n121wAAA";
let invalidToken = "w1800j1hh10wj0jd10jw901jdj";
beforeAll(async () => {
  await client.connect();

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
  dummyData = newUser;

  const { insertedId } = await db.collection("RoomFriends").insertOne({
    members: [1000, 1001],
    sender: "Feliri Siloam",
  });

  newRoomId = insertedId;
});

afterAll(async () => {
  await client.connect();

  await db.collection("RoomFriends").deleteOne({ sender: "Admin Sitompul" });

  await db.collection("message").deleteMany({ roomFriendId: 1000 });
});

describe("Message routes test", () => {
  ////////////////////// POST messages/roomFriend //////////////////////
  describe("POST messages/roomFriend", () => {
    test("should return status code 201 - should user successfully make a new room", async () => {
      const response = await request(app)
        .post("/messages/roomFriend")
        .set("access_token", validToken)
        .send({
          receiverId: 2,
          sender: dummyData.fullName,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("acknowledged", expect.any(Boolean));
      expect(response.body).toHaveProperty("insertedId", expect.any(String));
    });

    test("should return status code 400 - should user failed to make a new room", async () => {
      const response = await request(app)
        .post("/messages/roomFriend")
        .set("access_token", validToken)
        .send({
          receiverId: 2,
          sender: dummyData.fullName,
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  ////////////////////// GET messages/roomFriend //////////////////////
  describe("GET messages/roomFriend", () => {
    test("should return status code 200 - should user successfully get all chat room", async () => {
      const response = await request(app)
        .get("/messages/roomFriend")
        .set("access_token", validToken);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
    });
  });

  ////////////////////// GET /messages/:roomFriendId //////////////////////
  describe("GET /messages/findmessage/:roomFriendId", () => {
    test("should return status code 200 - should user successfully get all messages", async () => {
      const response = await request(app)
        .get(`/messages/findmessage/${newRoomId}`)
        .set("access_token", validToken);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
    });
  });

  ////////////////////// GET /messages/:friendid //////////////////////

  ///////////////// DELETE messages/conversation/:roomfriendid ////////////////
  describe("DELETE messages/conversation/:roomfriendid", () => {
    test("should return status code 200 - should user successfully delete a chat room", async () => {
      const response = await request(app)
        .delete(`/messages/conversation/${newRoomId}`)
        .set("access_token", validToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("should return status code 400 - should user failed to delete a chat room", async () => {
      const response = await request(app)
        .delete(`/messages/conversation/${newRoomId}`)
        .set("access_token", validToken);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });

  ////////////////////// POST message/addmessage //////////////////////
  describe("POST /message/addmessage", () => {
    test("should return status code 200 - should message text sent successfully", async () => {
      const response = await request(app)
        .post("/messages/addmessage")
        .set("access_token", validToken)
        .send({
          roomfriendid: 1000,
          text: "Hello World ini aku dari testing ya!",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("should return status code 200 - should message photo sent successfully", async () => {
      const response = await request(app)
        .post("/messages/addmessage")
        .set("access_token", validToken)
        .send({
          roomfriendid: 1000,
          photo:
            "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });

    test("should return status code 400 - should message error to be sent", async () => {
      const response = await request(app)
        .post("/messages/addmessage")
        .set("access_token", validToken)
        .send({
          roomfriendid: 1000,
          text: "",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", expect.any(String));
    });
  });
});
