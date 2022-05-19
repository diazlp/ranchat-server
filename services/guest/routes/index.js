const express = require("express");
const router = express.Router();
const GuestController = require("../controllers");

router.get("/", GuestController.index);

module.exports = router;
