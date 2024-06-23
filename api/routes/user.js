const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const checkAuth = require("../middleware/checkAuth");

router.get("/", checkAuth, userController.getUsers);

router.post("/signup", userController.userSignup);

router.post("/login", userController.userLogin);

router.delete("/:userId", checkAuth, userController.deleteUserById);

module.exports = router;
