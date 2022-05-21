const request = require("supertest");
const { app } = require("../app");
const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");

let validToken;
let invalidToken = "w1800j1hh10wj0jd10jw901jdj";

beforeAll(async () => {
  await User.destroy({ truncate: true, cascade: true, restartIdentity: true });

  const newUser = await User.create({
    name: "malik",
    username: "malik",
    email: "malik@mail.com",
    password: "12345",
    role: "admin",
  });

  let data = [
    {
      name: "debby",
      username: "debbyria",
      email: "debbyria@mail.com",
      password: "12345",
      role: "consultant",
    },
    {
      name: "zakiy",
      username: "zakiynurhasyim",
      email: "zakiynurhasyim@mail.com",
      password: "12345",
      role: "consultant",
    },
  ];

  await User.bulkCreate(data);

  validToken = tokenGenerator({
    id: newAdmin.id,
    email: newAdmin.email,
  });
});
