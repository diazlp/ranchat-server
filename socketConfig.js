const { Server } = require("socket.io");
const server = require("./bin/http");
// const { io } = require("./app");
// const io = require("socket.io")();

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

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

module.exports = io;
