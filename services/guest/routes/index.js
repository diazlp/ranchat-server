const express = require("express");
const router = express.Router();

const guestRoutes = require("./guestRoutes");
const friendRoutes = require("./friendRoutes");
router.use("/guest", guestRoutes);
router.use("/friends", friendRoutes);
module.exports = router;
