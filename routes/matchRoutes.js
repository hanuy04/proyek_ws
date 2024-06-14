const express = require("express");
const { addMatches, deleteMatches } = require("../controllers/matchController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

// Post
router.post("/addMatches", verifyToken, addMatches);

// Get

// Put

// Delete
router.delete("/deleteMatches/:match_id", verifyToken, deleteMatches);

module.exports = router;
