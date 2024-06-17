const express = require("express");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

const {
  getAllInvoice,
  getOneUserInvoice,
  getAllTransaction,
  getOneUserTransaction,
  getAllUser,
} = require("../controllers/admin");
const { route } = require("./ticketRoutes");

router.get("/getInvoice", verifyToken, getAllInvoice);

router.get("/getInvoice/:username", verifyToken, getOneUserInvoice);

router.get("/getTransaction", verifyToken, getAllTransaction);

router.get("/getTransaction/:username", verifyToken, getOneUserTransaction);

router.get("/getAllUser", verifyToken, getAllUser);

module.exports = router;
