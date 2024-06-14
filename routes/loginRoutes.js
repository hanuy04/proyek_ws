const express = require("express");
const { loginAdmin } = require("../controllers/login.js");
const router = express.Router();

router.post("/login", loginAdmin);

module.exports = router;
