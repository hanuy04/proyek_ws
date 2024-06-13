const express = require("express");
const {
  queryAnime,
  getDiscord,
  postDiscord,
  getRajaOngkirCost,
} = require("../controllers/contohAxios");
const router = express.Router();

router.get("/anime", queryAnime);
router.get("/discord", getDiscord);
router.post("/discord", postDiscord);
router.get("/rajaongkir/cost", getRajaOngkirCost);

module.exports = router;
