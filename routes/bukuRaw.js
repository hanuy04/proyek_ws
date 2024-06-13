const express = require("express");
const {
    queryBuku,
    getSingleBuku,
    storeBuku,
    updateBuku,
    patchBuku,
    deleteBuku,
} = require("../controllers/bukuRaw");
const router = express.Router();

// /api/v1/bukuRaw bagian ini kita taruh sebagai prefix di index.js
router.get("/", queryBuku); // GET (baca) localhost:3000/api/v1/bukuRaw
router.get("/:buku_id", getSingleBuku); // GET (baca) localhost:3000/api/v1/bukuRaw/8
router.post("/", storeBuku); // POST (insert) localhost:3000/api/v1/bukuRaw
router.put("/:buku_id", updateBuku); // PUT (update keseluruhan) localhost:3000/api/v1/bukuRaw/8
router.patch("/:buku_id", patchBuku); // PATCH (update sebagian) localhost:3000/api/v1/bukuRaw/8
router.delete("/:buku_id", deleteBuku); // DELETE (delete) localhost:3000/api/v1/bukuRaw/8

module.exports = router;
