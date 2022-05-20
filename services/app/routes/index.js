const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const paymentRoutes = require("./paymentRoutes");

router.use("/user", userRoutes);
router.use("/payment", paymentRoutes);

module.exports = router;
