const express = require("express");
const { loginAdmin, loginUser } = require("../controllers/login.js");
const router = express.Router();

router.post("/loginAdmin", loginAdmin);
router.post("/loginUser", loginUser);

module.exports = router;
