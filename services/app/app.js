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

const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Socket.io related
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const routes = require("./routes");

app.use("/", routes);

/* INI BUAT BROADCAST KE SELURUH USER */
// io.on("connection", (socket) => {
//   socket.on("send_message", (data) => {
//     socket.broadcast.emit("receive_message", data);
//   });
// });
////////

/* INI BUAT JOIN ROOM DAN SEND MESSAGE KE PRIVATE ROOM */
// io.on("connection", (socket) => {
//   socket.on("join_room", (data) => {
//     socket.join(data);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });
// });

const ChatController = require("./controllers/ChatController");
const chat = io.of("/chat").on("connection", function (socket) {
  socket.emit("me", socket.id);

  ChatController.sendMessage(chat, socket);
  ChatController.fetchStranger(chat, socket);
  ChatController.disconnected(chat, socket);
  ChatController.videoCallRequest(chat, socket);
  ChatController.answerCall(chat, socket);
});

app.use(errorHandler);

module.exports = { server };
