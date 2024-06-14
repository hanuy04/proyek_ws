const express = require("express");
const { addGame, updateGames } = require("../controllers/gameController");
const { getGames } = require("../controllers/gameController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

// Post
router.post("/addGame/:game_id", verifyToken, addGame);

// Get
router.get("/getGames", getGames);

// Put
router.put("/updateGames/:game_id", verifyToken, updateGames);
// router.put("/updateTeam", verifyToken, updateTeam);
// router.put("/updateMatch", verifyToken, updateMatch);
// router.put("/updateTicket", verifyToken, updateTicket); // Blm

module.exports = router;
