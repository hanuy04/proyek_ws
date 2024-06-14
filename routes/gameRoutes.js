const express = require("express");
const { addGame } = require("../controllers/gameController");
const { getGames } = require("../controllers/gameController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

router.post("/addGame/:game_id", verifyToken, addGame);
router.get("/getGames", getGames);

module.exports = router;
