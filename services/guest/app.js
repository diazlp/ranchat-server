if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const cors = require("cors");
const express = require("express");
const app = express();
const routes = require("./routes");
const { connection } = require("./config/mongoConnection");
const errorHandler = require("./middlewares/errorHandler");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("socket: ", socket);
  console.log(`User connected:`, socket.id);

  socket.on("join_room", (data) => {
    console.log("data: ", data);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

app.use("/", routes);

app.use(errorHandler);

const port = process.env.PORT || 4002;

connection().then(() => {
  app.listen(port, () => {
    console.log(`Guest server is running on port ${port}`);
  });
});
