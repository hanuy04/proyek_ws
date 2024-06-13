const express = require("express");
const {
    queryBuku,
    getSingleBuku,
    storeBuku,
    updateBuku,
    patchBuku,
    deleteBuku,
    contohRelasi,
} = require("../controllers/bukuORM");
const router = express.Router();

router.get("/", queryBuku);
// router.get("/:buku_id", getSingleBuku);
router.post("/", storeBuku);
router.put("/:buku_id", updateBuku);
router.patch("/:buku_id", patchBuku);
router.delete("/:buku_id", deleteBuku);
router.get("/contohrelasi", contohRelasi);

module.exports = router;
