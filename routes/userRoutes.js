const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const requireLogin = require("../middlewares/requireLogin");

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.post("/verify", requireLogin, UserController.verify);
router.post("/", requireLogin, UserController.findUser);

router.post("/profile", requireLogin, UserController.addProfile);
router.get("/profile", requireLogin, UserController.findProfile);

module.exports = router;
