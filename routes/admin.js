const express = require("express");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

const {
  getAllInvoice,
  getOneUserInvoice,
  getAllTransaction,
  getOneUserTransaction,
} = require("../controllers/admin");
const { route } = require("./ticketRoutes");

router.get("/getInvoice", verifyToken, getAllInvoice);

router.get("/getInvoice/:username", verifyToken, getOneUserInvoice);

router.get("/getTransaction", verifyToken, getAllTransaction);

router.get("/getTransaction/:username", verifyToken, getOneUserTransaction);

module.exports = router;
