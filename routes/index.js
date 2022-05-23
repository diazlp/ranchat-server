const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const paymentRoutes = require("./paymentRoutes");
const friendRoutes = require("./friendRoutes");
const guestRouter = require("./guestRoutes");
const multerRoutes = require("./multer");

router.use("/user", userRoutes);
router.use("/payment", paymentRoutes);
router.use("/friends", friendRoutes);
router.use("/guest", guestRouter);
router.use("/multer", multerRoutes);

module.exports = router;
