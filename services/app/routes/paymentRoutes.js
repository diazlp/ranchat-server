const express = require("express");
const router = express.Router();

const PaymentController = require("../controllers/PaymentController");
const requireLogin = require("../middlewares/requireLogin");
const requireVerification = require("../middlewares/requireVerification");

router.post("/", requireLogin, requireVerification, PaymentController.payment);

module.exports = router;
