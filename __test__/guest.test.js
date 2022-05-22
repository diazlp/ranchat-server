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

  //   console.log(dummyData, "<<<< ini hasil dummyData");
});

afterAll(async () => {
  await client.connect();

  await db.collection("Guests").deleteOne({ _id: ObjectId(dummyData._id) });
});

describe.skip("Guest routes test", () => {
  describe.skip("POST /guest/addGuest", () => {
    test("should return status code 200 - should add new guest", async () => {
      const response = await request(app).post("/guest/addGuest");

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("acknowledged");
      expect(response.body).toHaveProperty("acknowledged", expect.any(Boolean));
      expect(response.body).toHaveProperty("insertedId");
      expect(response.body).toHaveProperty("insertedId", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe.skip("GET /guest", () => {
    test("should return status code 200 - should get all guests", async () => {
      const response = await request(app).get("/guest");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(expect.any(Array));
    });
  });

  describe.skip("GET /guest/:id", () => {
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

  describe.skip("DELETE /guest/:id", () => {
    test("should return status code 200 - should delete guest by id", async () => {
      const response = await request(app).delete(`/guest/${dummyData._id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("acknowledged");
      expect(response.body).toHaveProperty("acknowledged", expect.any(Boolean));
      expect(response.body).toHaveProperty("deletedCount");
      expect(response.body).toHaveProperty("deletedCount", expect.any(Number));
    });
  });

  describe.only("GET /guest/randomRoom", () => {
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

  describe.only("POST /guest/randomRoom", () => {
    test("should return status code 200 - should add new room", async () => {
      const response = await request(app)
        .post("/guest/randomRoom")
        .send({ guestSockedId: "diaz" });

      console.log(response.status);
      console.log(response.body);

      expect(response.status).toBe(200);
      //   expect(response.body).toHaveProperty("acknowledged");
      //   expect(response.body).toHaveProperty("acknowledged", expect.any(Boolean));
      //   expect(response.body).toHaveProperty("insertedId");
      //   expect(response.body).toHaveProperty("insertedId", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });
  });
});
