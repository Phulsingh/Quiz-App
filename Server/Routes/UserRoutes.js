const express = require("express");
const {Register, Login,Logout} = require("../Controllers/UserController.js");
const router = express.Router();



router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);

router.get("/", (req, res) => {
  res.send("Hello world");
});

module.exports = router;