const express = require("express");
const router = express.Router();

const guestRoutes = require("./guestRoutes");

router.use("/guest", guestRoutes);

module.exports = router;
