// module.exports = {
//   sendMessage: function (endpoint, socket) {
//     /* endpoint output: /chat */

//     socket.on("send_message", function (data) {
//       console.log(data);

//       socket.to(data.room).emit("receive_message", data);
//     });
//   },
//   fetchStranger: function (endpoint, socket) {
//     // harusnya nanti disini tempat fetch stranger

//     socket.on("join_room", (roomNumber) => {
//       socket.join(roomNumber);
//     });
//   },
//   disconnected: function (endpoint, socket) {
//     socket.on("disconnect", (data) => {
//       //   console.log("user disconnect");

//       // await delete guest
//       // await update user status
//       // await delete room/delete guest from room

//       //   console.log(data);
//       socket.emit("receive_message", "call has been ended");
//     });
//   },
//   videoCallRequest: function (endpoint, socket) {
//     socket.on("calluser", ({ userToCall, signalData, from, name }) => {
//       socket
//         .to(userToCall)
//         .emit("calluser", { signal: signalData, from, name });
//     });
//   },
//   answerCall: function (endpoint, socket) {
//     socket.on("answercall", (data) => {
//       socket.to(data.to).emit("callaccepted", data.signal);
//     });
//   },
// };
