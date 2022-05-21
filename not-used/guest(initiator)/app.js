if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const cors = require("cors");
const express = require("express");
const app = express();
const routes = require("./routes");
const { connection } = require("./config/mongoConnection");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", routes);

app.use(errorHandler);

const port = process.env.PORT || 4002;

connection().then(() => {
  app.listen(port, () => {
    console.log(`Guest server is running on port ${port}`);
  });
});
