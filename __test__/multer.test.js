const request = require("supertest");
const { app } = require("../app");
const fs = require("fs");

describe("Multer routes test", () => {
  describe("POST /multer", () => {
    test("should return status code 200 - should user payment succeeded", async () => {
      const response = await request(app)
        .post("/multer")
        .set("content-type", "multipart/form-data")
        .attach(
          "image",
          fs.readFileSync(`${__dirname}/image.test.jpg`),
          "tests/file.png"
        )
        .expect(200);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("imageUrl");
      expect(response.body).toHaveProperty("imageUrl", expect.any(String));
    });
  });
});
