const express = require("express");
const { addTicket, updateTicket, deleteTicket } = require("../controllers/ticketController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

// Post
router.post("/addTicket", verifyToken, addTicket);

// Get

// Put
router.put("/updateTicket/:name", verifyToken, updateTicket);

// Delete
router.delete("/deleteTicket/:name", verifyToken, deleteTicket);

module.exports = router;