const express = require("express");
const {
  singleFile,
  multiFile,
  getProfPic,
  listFile,
  renameFile,
  deleteFile,
} = require("../controllers/uploadFile");
const router = express.Router();

const multer = require("multer");
const fs = require("fs");
const path = require("path");
// Hati-hati pada saat nulis destination, depannya janggan dikasi /
// ini cara paling sederhana
// const upload = multer({ dest: "uploads/" });

const storageSingle = multer.diskStorage({
  destination: (req, file, callback) => {
    // kalau req.body tidak terbaca, pastikan field dengan tipe file, berada dipaling bawah
    const foldername = `uploads/${req.body.pengguna_nama}`;

    if (!fs.existsSync(foldername)) {
      fs.mkdirSync(foldername, { recursive: true });
    }

    callback(null, foldername);
  },
  filename: (req, file, callback) => {
    console.log(file);
    // ambil file extensionnya
    const fileExtension = path.extname(file.originalname).toLowerCase();

    // callback(null, "tes.jpg"); //ubah menjadi nama pilihan kita
    // callback(null, file.originalname); // pakai nama asli filenya
    callback(null, `profpic${fileExtension}`); //profpic.xlsx
  },
});

const uploadSingle = multer({
  storage: storageSingle,
  limits: {
    fileSize: 20000, // dalam byte, jadi 1000 byte = 1kb, 1000000 byte = 1mb
  },
  fileFilter: (req, file, callback) => {
    // file type yang diperbolehkan, dalam bentuk regex
    const filetypes = /jpeg|jpg|png|gif/;
    const fileExtension = path.extname(file.originalname).toLowerCase();

    const checkExtName = filetypes.test(fileExtension);
    const checkMimeType = filetypes.test(file.mimetype);

    if (checkExtName && checkMimeType) {
      callback(null, true);
    } else {
      callback(new Error("tipe data salah"), false);
    }
  },
});

router.post("/singleFile", uploadSingle.single("pengguna_pp"), singleFile);
// router.post(
//   "/multiFile",
//   upload.fields([{ name: "pengguna_pp" }, { name: "pengguna_file[]" }]),
//   multiFile
// );
router.get("/profpic", getProfPic);
router.get("/list", listFile);
router.get("/rename", renameFile);
router.delete("/delete", deleteFile);

module.exports = router;
