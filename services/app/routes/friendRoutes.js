const express = require("express");
const router = express.Router();
const FriendController = require("../controllers/FriendController");
const requireLogin = require("../middlewares/requireLogin");

router.use(requireLogin);
router.post("/", FriendController.sendFriendRequest); //add friend
router.get("/", FriendController.friendList); //friend list online or offline
router.get("/request", FriendController.friendRequestList); //friend request
router.patch("/:friendId", FriendController.acceptFriendRequest); //accept friend request
router.delete("/request/:friendId", FriendController.rejectFriendRequest); //reject friend request
router.delete("/:friendId", FriendController.deleteFriend); //delete friend
module.exports = router;
