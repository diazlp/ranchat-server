const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const paymentRoutes = require("./paymentRoutes");
const friendRoutes = require("./friendRoutes");

router.use("/user", userRoutes);
router.use("/payment", paymentRoutes);
router.use("/friends", friendRoutes);

module.exports = router;
