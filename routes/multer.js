const express = require("express");
const router = express.Router();
const MulterController = require("../controllers/MulterController");

const multer = require("multer");

const upload = multer();

router.post("/", upload.single("image"), MulterController.testing);

module.exports = router;
