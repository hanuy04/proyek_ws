const express = require("express");
const { addMatches } = require("../controllers/matchController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

router.post("/addMatches", verifyToken, addMatches);

module.exports = router;
