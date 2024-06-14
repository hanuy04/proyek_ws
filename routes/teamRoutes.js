const express = require("express");
const {
  addTeam,
  updateTeam,
  deleteTeam,
} = require("../controllers/teamController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

// Post
router.post("/addTeam", verifyToken, addTeam);

// Put
router.put("/updateTeam/:team_id", verifyToken, updateTeam);

// Delete
router.delete("/deleteTeam/:team_id", verifyToken, deleteTeam);

module.exports = router;
