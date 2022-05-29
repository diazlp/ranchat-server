/**
 * npx sequelize-cli model:generate --name User --attributes fullName:string,email:string,password:string,profilePicture:string,isVerified:boolean,verificationCode:string,city:string,status:boolean
 * npx sequelize-cli model:generate --name Friend --attributes UserId:integer,FriendId:integer,friendStatus:boolean
 * npx sequelize-cli model:generate --name Payment --attributes UserId:integer,checkoutDate:date
 *
 * TO CREATE A TEST DATABASE RUN THE FOLLOWING
 * npx sequelize-cli db:create --env=test
 * npx sequelize-cli db:migrate --env=test
 *
 * TO SEED ONE DATA AT A TIME
 * npx sequelize-cli db:seed --seed < file-name >.js
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

const routes = require("./routes");

app.use("/", routes);

app.use(errorHandler);

module.exports = app;

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
      "Access-Control-Allow-Origin",
    ],
    transports: ["websocket"],
  },
});

// const io = new Server(server, {
//   cors: {
//     origin: "*",
//     credentials: true,
//   },
// });

/* INI BUAT BROADCAST KE SELURUH USER */
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const removeUserLogout = (UserId) => {
  users = users.filter((user) => user.userId !== UserId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
/////

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  // FRIEND FEATURE (KEVIN)
  socket.on("friendRequest", (payload) => {
    // console.log("masuk receive friend Request");
    socket.to(payload.receiverId).emit("createfriendRequest", payload.userId);
  });

  // RANDOM CHAT (KEVIN)
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
      console.log(users, "online");

      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    ({ senderId, receiverId, text, friendRoom, photo, type }) => {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
      const user = getUser(receiverId);
      console.log(type);
      if (user) {
        io.to(user.socketId).emit("getMessage", {
          friendRoom,
          senderId,
          text,
          photo,
          type,
        });
      }
    }
  );

  socket.on("removeUserLogout", (UserId) => {
    if (UserId) {
      removeUserLogout(UserId);
      io.emit("getUsers", users);
      console.log("a user disconnected!");
    }
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
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

module.exports = { app, server };
