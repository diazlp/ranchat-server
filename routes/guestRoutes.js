const express = require("express");
const router = express.Router();
const GuestController = require("../controllers/GuestController");

router.get("/", GuestController.findGuests);
router.post("/addGuest", GuestController.addGuest);
router.get("/randomRoom", GuestController.findRooms);
router.post("/randomRoom", GuestController.randomRoom);
router.delete("/randomRoom/:id", GuestController.delRoom);
router.get("/:id", GuestController.findGuestById);
router.delete("/:id", GuestController.eraseGuest);

module.exports = router;
