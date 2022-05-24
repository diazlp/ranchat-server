/**
 * npx sequelize-cli model:generate --name User --attributes fullName:string,email:string,password:string,profilePicture:string,isVerified:boolean,verificationCode:string,city:string,status:boolean
 * npx sequelize-cli model:generate --name Friend --attributes UserId:integer,FriendId:integer,friendStatus:boolean
 * npx sequelize-cli model:generate --name Payment --attributes UserId:integer,checkoutDate:date
 *
 * TO CREATE A TEST DATABASE RUN THE FOLLOWING
 * npx sequelize-cli db:create --env=test
 * npx sequelize-cli db:migrate --env=test
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

//* Ini function buat socket io
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
////

/* INI BUAT BROADCAST KE SELURUH USER */
io.on("connection", (socket) => {
  // RANDOM CHAT (KEVIN)
  socket.emit("me", socket.id);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  }); //dummypage

  socket.on("sendMessageFromVideo", (payload) => {
    // console.log(payload);
    socket.to(payload.receiver).emit("receiveMessageFromVideo", payload);
  }); // send chat videoPage

  socket.on("calluser", ({ userToCall, signalData, from, name }) => {
    socket.to(userToCall).emit("calluser", { signal: signalData, from, name });
  });

  socket.on("answercall", (data) => {
    socket.to(data.to).emit("callaccepted", data.signal);
  });

  // FRIEND CHAT (FITRAH)
  socket.on("adduser", (UserId) => {
    if (UserId) {
      addUser(UserId, socket.id);
      io.emit("getUsers", users);
    }
  });

  socket.on("sendMessage", ({ senderId, receiverId, text, friendRoom }) => {
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", {
        friendRoom,
        senderId,
        text,
      });
    }
  });

  socket.on("disconnect", () => {
    // console.log("an user has disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
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

// const ChatController = require("./controllers/ChatController");
// const chat = io.of("/chat").on("connection", function (socket) {
//   socket.emit("me", socket.id);

//   ChatController.sendMessage(chat, socket);
//   ChatController.fetchStranger(chat, socket);
//   ChatController.disconnected(chat, socket);
//   ChatController.videoCallRequest(chat, socket);
//   ChatController.answerCall(chat, socket);
// });

app.use(errorHandler);

module.exports = { app, server };
