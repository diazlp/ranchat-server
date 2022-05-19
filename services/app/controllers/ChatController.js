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
  },
};
