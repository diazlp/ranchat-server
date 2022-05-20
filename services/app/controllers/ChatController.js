module.exports = {
  sendMessage: function (endpoint, socket) {
    /* endpoint output: /chat */

    socket.on("send_message", function (data) {
      socket.to(data.room).emit("receive_message", data);
    });
  },
  fetchStranger: function (endpoint, socket) {
    // harusnya nanti disini tempat fetch stranger

    socket.on("join_room", (data) => {
      socket.join(data);
    });

    socket.on("disconnect", () => {
      socket.broadcast.to(1).emit("user_leave", { user_name: "johnjoe123" });
      // users = users.filter((u) => u.id !== socket.id);
      // io.emit("new user", users);
    });
  },
};
