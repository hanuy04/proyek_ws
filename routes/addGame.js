const express = require("express");
const { addGame } = require("../controllers/addGame");
const router = express.Router();

router.post("/addGame", addGame);

module.exports = router;
