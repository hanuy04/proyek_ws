const express = require("express");
const {
  addGame,
  updateGames,
  deleteGames,
  getGames,
  getPlatforms,
  getRegions,
} = require("../controllers/gameController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

// Post
router.post("/addGame/:game_id", verifyToken, addGame);

// Get
router.get("/getGames", verifyToken, getGames);
router.get("/getPlatforms", getPlatforms);
router.get("/getRegions", getRegions);

// Get Game by ID
router.get("/getGames/:game_id", verifyToken, getGames);

// Put
router.put("/updateGames/:game_id", verifyToken, updateGames);

// Delete
router.delete("/deleteGames/:game_id", verifyToken, deleteGames);

module.exports = router;
