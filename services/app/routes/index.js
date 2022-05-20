const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const friendRoutes = require("./friendRoutes");
router.use("/user", userRoutes);
router.use("/friend", friendRoutes);
module.exports = router;
