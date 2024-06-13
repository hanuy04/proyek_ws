const express = require("express");
const {
    contoh,
    contohQuery,
    contohParams,
    contohPost,
    contohArrayFunction,
} = require("../controllers/contoh");
const router = express.Router();

// localhost:3000/api/v1/contoh

router.get("/contoh", contoh);

// /mimi/umur/100/jk/wanita
router.get("/contohParams/:nama/umur/:umur/jk/:jk", contohParams);
router.get("/contohQuery", contohQuery);
router.post("/contohPost", contohPost);

router.get("/contohArrayFunction", contohArrayFunction);

module.exports = router;
