/**
 * npx sequelize-cli model:generate --name User --attributes fullName:string,email:string,password:string,profilePicture:string,isVerified:boolean,verificationCode:string,city:string,status:boolean
 * npx sequelize-cli model:generate --name Friend --attributes UserId:integer,fullName:string,email:string,status:boolean
 *
 */

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const cors = require("cors");
const express = require("express");
const app = express();
const routes = require("./routes");

const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routes);

app.use(errorHandler);

module.exports = app;
