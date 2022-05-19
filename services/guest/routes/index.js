const express = require("express");
const router = express.Router();
const GuestController = require("../controllers");

router.get("/", GuestController.findGuests);
router.post("/", GuestController.addGuest);
router.get("/:id", GuestController.findGuestById);
router.delete("/:id", GuestController.findGuestById);

module.exports = router;
