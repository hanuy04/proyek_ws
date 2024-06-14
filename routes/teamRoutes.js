const express = require("express");
const { addTeam } = require("../controllers/teamController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

router.post("/addTeam", verifyToken, addTeam);

module.exports = router;
