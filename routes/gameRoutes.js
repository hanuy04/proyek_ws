const express = require("express");
const { addGame } = require("../controllers/gameController");
const { getGames } = require("../controllers/gameController");
const router = express.Router();

router.post("/addGame", addGame);
router.get("/getGames", getGames);

module.exports = router;
