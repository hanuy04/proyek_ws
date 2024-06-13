const express = require("express");
const { addGame } = require("../controllers/gameController");
const router = express.Router();

router.post("/addGame", addGame);

module.exports = router;
