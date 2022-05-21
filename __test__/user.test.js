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

describe.skip("User routes test", () => {
  ////////////////////// POST user/register //////////////////////
  describe("POST /user/register", () => {
    test("should return 201 status code - should the user successfully created", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({
          fullName: "Diaz Linggaputra",
          email: "diaz@mail.com",
          password: "admin",
        })
        .expect(201);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("fullName");
      expect(response.body).toHaveProperty("fullName", expect.any(String));
      expect(response.body).toHaveProperty("fullName", "Diaz Linggaputra");
      expect(response.body).toHaveProperty("email");
      expect(response.body).toHaveProperty("email", expect.any(String));
      expect(response.body).toHaveProperty("email", "diaz@mail.com");
    });

    test("should return 400 status code - should the email is duplicate", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({
          fullName: "Diaz Linggaputra",
          email: "diaz@mail.com",
          password: "admin",
        })
        .expect(400);

      expect(response.status).toBe(400);
      expect(response.text).toContain("Email address should be unique");
      expect(response.body.errors[0]).toHaveProperty("type", "email");
      expect(response.body.errors[0]).toHaveProperty(
        "type",
        expect.any(String)
      );
      expect(response.body.errors[0]).toHaveProperty(
        "message",
        expect.any(String)
      );
      expect(response.body.errors[0]).toHaveProperty(
        "message",
        "Email address should be unique"
      );
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 400 status code - should the email is invalid", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({
          fullName: "Diaz Linggaputra",
          email: "diaz@mail",
          password: "admin",
        })
        .expect(400);

      expect(response.status).toBe(400);
      expect(response.text).toContain("Email address is invalid");
      expect(response.body.errors[0]).toHaveProperty("type", "email");
      expect(response.body.errors[0]).toHaveProperty(
        "type",
        expect.any(String)
      );
      expect(response.body.errors[0]).toHaveProperty(
        "message",
        expect.any(String)
      );
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 400 status code - should the password is empty", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({
          fullName: "Diaz Linggaputra",
          email: "diaz@mail.com",
        })
        .expect(400);

      expect(response.status).toBe(400);
      expect(response.text).toContain("Password is required");
      expect(response.body.errors[0]).toHaveProperty("type", "password");
      expect(response.body.errors[0]).toHaveProperty(
        "type",
        expect.any(String)
      );
      expect(response.body.errors[0]).toHaveProperty(
        "message",
        "Password is required"
      );
      expect(response.body.errors[0]).toHaveProperty(
        "message",
        expect.any(String)
      );
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 400 status code - should the email address is empty", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({
          fullName: "Diaz Linggaputra",
          email: "",
          password: "admin",
        })
        .expect(400);

      expect(response.status).toBe(400);
      expect(response.text).toContain("Email address is required");
      expect(response.body.errors[0]).toHaveProperty("type", "email");
      expect(response.body.errors[0]).toHaveProperty(
        "type",
        expect.any(String)
      );
      expect(response.body.errors[0]).toHaveProperty(
        "message",
        "Email address is required"
      );
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 400 status code - should the full name is empty", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({
          fullName: "",
          email: "diaz@mail.com",
          password: "admin",
        })
        .expect(400);

      expect(response.status).toBe(400);
      expect(response.text).toContain("Fullname is required");
      expect(response.body.errors[0]).toHaveProperty("type", "fullName");
      expect(response.body.errors[0]).toHaveProperty(
        "type",
        expect.any(String)
      );
      expect(response.body.errors[0]).toHaveProperty(
        "message",
        "Fullname is required"
      );
      expect(response.body.errors[0]).toHaveProperty(
        "message",
        expect.any(String)
      );
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 400 status code - should the full name is not containing two words", async () => {
      const response = await request(app)
        .post("/user/register")
        .send({
          fullName: "Diaz",
          email: "diaz@mail.com",
          password: "admin",
        })
        .expect(400);

      expect(response.status).toBe(400);
      expect(response.text).toContain("Fullname should be at least two words");
      expect(response.body.errors[0]).toHaveProperty("type", "fullName");
      expect(response.body.errors[0]).toHaveProperty(
        "type",
        expect.any(String)
      );
      expect(response.body.errors[0]).toHaveProperty(
        "message",
        "Fullname should be at least two words"
      );
      expect(response.body.errors[0]).toHaveProperty(
        "message",
        expect.any(String)
      );
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  ////////////////////// POST user/login //////////////////////
  describe("POST /user/login", () => {
    test("should return 200 status code - should the user login", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          email: "diaz@mail.com",
          password: "admin",
        })
        .expect(200);

      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token", expect.any(String));
      expect(response.body).toHaveProperty("profile", expect.any(Object));
      expect(response.body.profile).toHaveProperty("id");
      expect(response.body.profile).toHaveProperty("id", expect.any(Number));
      expect(response.body.profile).toHaveProperty("fullName");
      expect(response.body.profile).toHaveProperty(
        "fullName",
        expect.any(String)
      );
      expect(response.body.profile).toHaveProperty("email");
      expect(response.body.profile).toHaveProperty("email", expect.any(String));
      expect(response.body.profile).toHaveProperty("isVerified");
      expect(response.body.profile).toHaveProperty(
        "isVerified",
        expect.any(Boolean)
      );
      expect(response.body.profile).toHaveProperty("status");
      expect(response.body.profile).toHaveProperty(
        "status",
        expect.any(Boolean)
      );
    });

    test("should return 400 status code - should the email is empty", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          email: "",
          password: "admin",
        })
        .expect(400);

      expect(response.status).toBe(400);
      expect(response.text).toContain("Email is required");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toHaveProperty("message", "Email is required");
    });

    test("should return 400 status code - should the password is empty", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          email: "diaz@mail.com",
          password: "",
        })
        .expect(400);

      expect(response.status).toBe(400);
      expect(response.text).toContain("Password is required");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toHaveProperty("message", "Password is required");
    });

    test("should return 400 status code - should the email is not registered", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          email: "raden@mail.com",
          password: "admin",
        })
        .expect(401);

      expect(response.status).toBe(401);
      expect(response.text).toContain("Email/password is invalid");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toHaveProperty(
        "message",
        "Email/password is invalid"
      );
    });

    test("should return 400 status code - should the password is not correct", async () => {
      const response = await request(app)
        .post("/user/login")
        .send({
          email: "diaz@mail.com",
          password: "admi",
        })
        .expect(401);

      expect(response.status).toBe(401);
      expect(response.text).toContain("Email/password is invalid");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toHaveProperty(
        "message",
        "Email/password is invalid"
      );
    });
  });

  ////////////////////// POST user/verify //////////////////////
  describe("POST /user/verify", () => {
    test("should return 200 status code - should user successfully verify", async () => {
      const response = await request(app)
        .post("/user/verify")
        .set("access_token", validToken)
        .send({ verificationCode })
        .expect(200);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toHaveProperty(
        "message",
        "Email successfully verified"
      );
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 400 status code - should the verification code is empty", async () => {
      const response = await request(app)
        .post("/user/verify")
        .set("access_token", validToken)
        .send({ verificationCode: "" })
        .expect(400);

      expect(response.status).toBe(400);
      expect(response.text).toContain("Please enter verification code");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toHaveProperty(
        "message",
        "Please enter verification code"
      );
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 400 status code - should the verification code is not correct", async () => {
      const response = await request(app)
        .post("/user/verify")
        .set("access_token", validToken)
        .send({ verificationCode: "1234" })
        .expect(400);

      expect(response.status).toBe(400);
      expect(response.text).toContain("Verification code is not valid");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toHaveProperty(
        "message",
        "Verification code is not valid"
      );
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 400 status code - should the token is empty", async () => {
      const response = await request(app)
        .post("/user/verify")
        .set("access_token", "")
        .send({ verificationCode })
        .expect(401);

      expect(response.status).toBe(401);
      expect(response.text).toContain("Invalid token");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toHaveProperty("message", "Invalid token");
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 400 status code - should the token is not valid", async () => {
      const response = await request(app)
        .post("/user/verify")
        .set("access_token", invalidToken)
        .send({ verificationCode })
        .expect(401);

      expect(response.status).toBe(401);
      expect(response.text).toContain("Invalid token");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toHaveProperty("message", "Invalid token");
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  ////////////////////// POST user/profile //////////////////////
  describe("POST /user/profile", () => {
    test("should return 200 status code - should user profile is created", async () => {
      const response = await request(app)
        .post("/user/profile")
        .set("access_token", validToken)
        .send({
          profilePicture:
            "https://qph.fs.quoracdn.net/main-thumb-232107885-200-linvaatajjbefwvhflvqkusetqtajbli.jpeg",
          birthday: "1997-06-07",
          address: "Bandung, Jawa Barat",
          gender: "male",
          bio: "aku orang terkece dihactiv 8 gk ada yg bisa ngalahin aku",
          banner:
            "https://img.freepik.com/free-vector/abstract-geometric-blue-wide-background-banner-layout-design_1017-23062.jpg?w=2000",
          facebook: "https://www.facebook.com/diaz.linggaputra",
          instagram: "https://www.instagram.com/diazlp/?hl=en",
          twitter: "https://twitter.com/dyzrain",
        })
        .expect(201);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("profilePicture");
      expect(response.body).toHaveProperty(
        "profilePicture",
        expect.any(String)
      );
      expect(response.body).toHaveProperty("birthday");
      expect(response.body).toHaveProperty("birthday", expect.any(String));
      expect(response.body).toHaveProperty("address");
      expect(response.body).toHaveProperty("address", expect.any(String));
      expect(response.body).toHaveProperty("gender");
      expect(response.body).toHaveProperty("gender", expect.any(String));
      expect(response.body).toHaveProperty("bio");
      expect(response.body).toHaveProperty("bio", expect.any(String));
      expect(response.body).toHaveProperty("bio");
      expect(response.body).toHaveProperty("bio", expect.any(String));
      expect(response.body).toHaveProperty("facebook");
      expect(response.body).toHaveProperty("facebook", expect.any(String));
      expect(response.body).toHaveProperty("instagram");
      expect(response.body).toHaveProperty("instagram", expect.any(String));
      expect(response.body).toHaveProperty("twitter");
      expect(response.body).toHaveProperty("twitter", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 201 status code - should the user profile is updated", async () => {
      const response = await request(app)
        .post("/user/profile")
        .set("access_token", validToken)
        .send({
          profilePicture: "",
          gender: "helicopter",
          birthday: "1997-05-23",
          address: "Jakarta Kota, Jawa Barat",
          bio: "aku orang terkece dihactiv 8 gk ada yg bisa ngalahin aku",
          banner: "",
          facebook: "",
          instagram: "",
          twitter: "",
        })
        .expect(201);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("id", expect.any(Number));
      expect(response.body).toHaveProperty("profilePicture");
      expect(response.body).toHaveProperty(
        "profilePicture",
        expect.any(String)
      );
      expect(response.body).toHaveProperty("birthday");
      expect(response.body).toHaveProperty("birthday", expect.any(String));
      expect(response.body).toHaveProperty("address");
      expect(response.body).toHaveProperty("address", expect.any(String));
      expect(response.body).toHaveProperty("gender");
      expect(response.body).toHaveProperty("gender", expect.any(String));
      expect(response.body).toHaveProperty("bio");
      expect(response.body).toHaveProperty("bio", expect.any(String));
      expect(response.body).toHaveProperty("bio");
      expect(response.body).toHaveProperty("bio", expect.any(String));
      expect(response.body).toHaveProperty("facebook");
      expect(response.body).toHaveProperty("facebook", expect.any(String));
      expect(response.body).toHaveProperty("instagram");
      expect(response.body).toHaveProperty("instagram", expect.any(String));
      expect(response.body).toHaveProperty("twitter");
      expect(response.body).toHaveProperty("twitter", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 400 status code - should the token is empty", async () => {
      const response = await request(app)
        .post("/user/profile")
        .set("access_token", "")
        .send({
          profilePicture:
            "https://qph.fs.quoracdn.net/main-thumb-232107885-200-linvaatajjbefwvhflvqkusetqtajbli.jpeg",
          birthday: "1997-06-07",
          address: "Bandung, Jawa Barat",
        })
        .expect(401);

      expect(response.status).toBe(401);
      expect(response.text).toContain("Invalid token");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toHaveProperty("message", "Invalid token");
      expect(response.body).toBeInstanceOf(Object);
    });

    test("should return 400 status code - should the token is not valid", async () => {
      const response = await request(app)
        .post("/user/profile")
        .set("access_token", invalidToken)
        .send({
          profilePicture:
            "https://qph.fs.quoracdn.net/main-thumb-232107885-200-linvaatajjbefwvhflvqkusetqtajbli.jpeg",
          birthday: "1997-06-07",
          address: "Bandung, Jawa Barat",
        })
        .expect(401);

      expect(response.status).toBe(401);
      expect(response.text).toContain("Invalid token");
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("message", expect.any(String));
      expect(response.body).toHaveProperty("message", "Invalid token");
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  ////////////////////// GET user/profile //////////////////////
  describe("GET /user/profile", () => {
    test("should return 200 status code - should the user profile is found", async () => {
      const response = await request(app)
        .get("/user/profile")
        .set("access_token", validToken)
        .expect(200);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("profilePicture");
      expect(response.body).toHaveProperty(
        "profilePicture",
        expect.any(String)
      );
      expect(response.body).toHaveProperty("birthday");
      expect(response.body).toHaveProperty("birthday", expect.any(String));
      expect(response.body).toHaveProperty("address");
      expect(response.body).toHaveProperty("address", expect.any(String));
      expect(response.body).toHaveProperty("gender");
      expect(response.body).toHaveProperty("gender", expect.any(String));
      expect(response.body).toHaveProperty("bio");
      expect(response.body).toHaveProperty("bio", expect.any(String));
      expect(response.body).toHaveProperty("bio");
      expect(response.body).toHaveProperty("bio", expect.any(String));
      expect(response.body).toHaveProperty("facebook");
      expect(response.body).toHaveProperty("facebook", expect.any(String));
      expect(response.body).toHaveProperty("instagram");
      expect(response.body).toHaveProperty("instagram", expect.any(String));
      expect(response.body).toHaveProperty("twitter");
      expect(response.body).toHaveProperty("twitter", expect.any(String));
      expect(response.body).toBeInstanceOf(Object);
    });
  });
});
