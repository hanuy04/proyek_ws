const express = require("express");
const {
  addTeam,
  updateTeam,
  deleteTeam,
  getTeam,
} = require("../controllers/teamController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

// Post
router.post("/addTeam", verifyToken, addTeam);

// Put
router.put("/updateTeam/:team_id", verifyToken, updateTeam);

// Delete
router.delete("/deleteTeam/:team_id", verifyToken, deleteTeam);

// Get Teams
router.get("/getTeams", verifyToken, getTeam);

// Fav Teams
router.post("/favTeams/:team_id", verifyToken, favTeam);

module.exports = router;
