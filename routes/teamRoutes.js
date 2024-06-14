const express = require("express");
const { addTeam } = require("../controllers/teamController");
const router = express.Router();

router.post("/addTeam", addTeam);

module.exports = router;
