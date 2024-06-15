const express = require("express");
const {
  addTicket,
  updateTicket,
  deleteTicket,
  seeTicket,
} = require("../controllers/ticketController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

// Post
router.post("/addTicket", verifyToken, addTicket);

// Put
router.put("/updateTicket/:name", verifyToken, updateTicket);

// Delete
router.delete("/deleteTicket/:name", verifyToken, deleteTicket);

router.get("/seeTickets", verifyToken, seeTicket);

module.exports = router;
