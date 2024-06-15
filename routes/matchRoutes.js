const express = require("express");
const {
  addMatches,
  deleteMatches,
  getMatches,
} = require("../controllers/matchController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

// Post
router.post("/addMatches", verifyToken, addMatches);

// Delete
router.delete("/deleteMatches/:match_id", verifyToken, deleteMatches);

// Get Matches
router.get("/getMatches", verifyToken, getMatches);

// Get Detail Match
router.get("/getDetailMatch/:match_id", verifyToken, getDetailMatch);

module.exports = router;
