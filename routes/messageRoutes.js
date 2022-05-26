const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/messageController");
const requireLogin = require("../middlewares/requireLogin");

const multer = require("multer");
const upload = multer();

router.use(requireLogin);
router.post("/roomfriend", MessageController.addRoomFriend); //add RoomFriend
router.get("/roomfriend", MessageController.findRoomFriend); //find RoomFriend
router.delete(
  "/conversation/:roomfriendid",
  MessageController.deleteRoomFriend
); //delete RoomFriend

router.post(
  "/addmessage",
  upload.single("image"),
  MessageController.addMessage
); //add message

router.get("/findmessage/:roomfriendid", MessageController.findMessage); //find message
// router.get("/findlastmessage/:friendid", MessageController.findLastMessage);

module.exports = router;
