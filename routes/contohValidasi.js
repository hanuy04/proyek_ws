const express = require("express");
const {
  validasiUser,
  validasiCustom,
} = require("../controllers/contohValidasi");
const router = express.Router();

router.post("/user", validasiUser);
router.post("/custom", validasiCustom);

module.exports = router;
