const express = require("express");
const router = express.Router();
const user = require("../controllers/userController");

router.post("/signUp", user.signUp);
router.post("/signIn", user.signIn);

module.exports = router;
