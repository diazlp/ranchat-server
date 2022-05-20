const express = require("express");
const router = express.Router();
const FriendController = require("../controllers/FriendController");

router.post("/", FriendController.sendFriendRequest); //add friend
router.get("/", FriendController.friendList); //friend list online or offline
router.get("/request", FriendController.friendRequestList); //friend request
// router.patch("/:friendId",) //accept friend request
// router.delete("/:userId",) //delete friend
module.exports = router;
