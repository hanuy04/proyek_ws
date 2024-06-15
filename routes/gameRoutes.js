const express = require("express");
const {
  addGame,
  updateGames,
  deleteGames,
} = require("../controllers/gameController");
const { getGames } = require("../controllers/gameController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

// Post
router.post("/addGame/:game_id", verifyToken, addGame);

// Get
router.get("/getGames", getGames);

// Get Game by ID
router.get("/getGames/:game_id", getGames);

// Put
router.put("/updateGames/:game_id", verifyToken, updateGames);

// Delete
router.delete("/deleteGames/:game_id", verifyToken, deleteGames);

module.exports = router;
