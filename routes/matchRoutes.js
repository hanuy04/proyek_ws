const express = require("express");
const { addMatches } = require("../controllers/matchController");
const router = express.Router();

router.post("/addMatches", addMatches);

module.exports = router;
