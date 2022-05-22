const request = require("supertest");
const { app } = require("../app");
const { MongoClient, ObjectId } = require("mongodb");
const { generateUsername } = require("unique-username-generator");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

const db = client.db("ranchat");

let dummyData;
let dummySocketId = "waufhsnd19h1n121wAAA";
beforeAll(async () => {
  /////////
  await client.connect();

  let num = "";
  for (let i = 0; i < 4; i++) {
    num += (Math.floor(Math.random() * 9) + 1).toString();
  }
  const guestName = `Guest${generateUsername("", 0, 12)}#${num}`;

  num = "";
  for (let i = 0; i < 8; i++) {
    num += (Math.floor(Math.random() * 9) + 1).toString();
  }
  ///////

  const { insertedId } = await db.collection("Guests").insertOne({
    guest: guestName,
    identifier: dummySocketId,
  });
  //   console.log(newGuest, "<<<< ini hasil newGuest");
  dummyData = await db
    .collection("Guests")
    .findOne({ _id: ObjectId(insertedId) });

  await db.collection("Rooms").deleteMany({});
});

afterAll(async () => {
  await client.connect();

  await db.collection("Guests").deleteOne({ _id: ObjectId(dummyData._id) });

  await db.collection("Rooms").deleteMany({});
});

describe("Guest routes test", () => {
  describe("POST /guest/addGuest", () => {
    test("should return status code 200 - should add new guest", async () => {
      const response = await request(app)
        .post("/guest/addGuest")
        .send({ socketId: "waufhsnd19h1n121wAAA" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("mongoId");
      expect(response.body).toHaveProperty("mongoId", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("GET /guest", () => {
    test("should return status code 200 - should get all guests", async () => {
      const response = await request(app).get("/guest");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
    });
  });

  describe("GET /guest/:id", () => {
    test("should return status code 200 - should get guest by id", async () => {
      const response = await request(app).get(`/guest/${dummyData._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("guest");
      expect(response.body).toHaveProperty("guest", expect.any(String));
      expect(response.body).toHaveProperty("identifier");
      expect(response.body).toHaveProperty("identifier", expect.any(String));
    });
  });

  describe("DELETE /guest/:id", () => {
    test("should return status code 200 - should delete guest by id", async () => {
      const response = await request(app).delete(`/guest/${dummyData._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("acknowledged");
      expect(response.body).toHaveProperty("acknowledged", expect.any(Boolean));
      expect(response.body).toHaveProperty("deletedCount");
      expect(response.body).toHaveProperty("deletedCount", expect.any(Number));
    });
  });

  describe("GET /guest/randomRoom", () => {
    test("should return status code 200 - should get random room", async () => {
      const response = await request(app).get("/guest/randomRoom");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
      //   expect(response.body).toHaveProperty("_id");
      //   expect(response.body).toHaveProperty("_id", expect.any(String));
      //   expect(response.body).toHaveProperty("guest");
      //   expect(response.body).toHaveProperty("guest", expect.any(String));
      //   expect(response.body).toHaveProperty("identifier");
      //   expect(response.body).toHaveProperty("identifier", expect.any(String));
    });
  });

  describe("POST /guest/randomRoom", () => {
    test("should return status code 200 - should add new room", async () => {
      const response = await request(app)
        .post("/guest/randomRoom")
        .send({ socketId: "diaz" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("acknowledged");
      expect(response.body).toHaveProperty("acknowledged", expect.any(Boolean));
      expect(response.body).toHaveProperty("insertedId");
      expect(response.body).toHaveProperty("insertedId", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return status code 200 - should add new caller id in existing room", async () => {
      const response = await request(app)
        .post("/guest/randomRoom")
        .send({ socketId: "fitrah" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id");
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("guestCaller");
      expect(response.body).toHaveProperty("guestCaller", expect.any(String));
      expect(response.body).toHaveProperty("guestCalled");
      expect(response.body).toHaveProperty("guestCalled", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return status code 200 - should add new room", async () => {
      const response = await request(app)
        .post("/guest/randomRoom")
        .send({ socketId: "raden" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("acknowledged");
      expect(response.body).toHaveProperty("acknowledged", expect.any(Boolean));
      expect(response.body).toHaveProperty("insertedId");
      expect(response.body).toHaveProperty("insertedId", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("DELETE /guest/randomRoom/:id", () => {
    test("should return status code 200 - should delete room by id", async () => {
      const findRooms = await db.collection("Rooms").find().toArray();

      const response = await request(app).delete(
        `/guest/randomRoom/${ObjectId(findRooms[0]._id)}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("acknowledged");
      expect(response.body).toHaveProperty("acknowledged", expect.any(Boolean));
      expect(response.body).toHaveProperty("deletedCount");
      expect(response.body).toHaveProperty("deletedCount", expect.any(Number));
    });
  });
});
