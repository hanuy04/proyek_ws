const express = require("express");
const {
  deleteUser,
  blockUser,
  register,
  updateProfile,
  topUpUser,
  buyApiHit,
  forgetPassword,
  addPhotoProfile,
  updatePhotoProfile,
  buyTicket,
  cancelTicket,
  getUserTickets,
  deletePhotoProfile,
  deleteUsers,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./upload" });
const fs = require("fs");

// Post
router.post("/register", register);

// Put
router.put("/blockUser", verifyToken, blockUser);
router.put("/updateProfile/:username", verifyToken, updateProfile);

// Delete
router.delete("/deleteUser", verifyToken, deleteUser);

router.delete("/deletePhotoProfile", verifyToken, deletePhotoProfile);

router.post("/topUpSaldo", verifyToken, topUpUser);

router.post("/buyApiHit", verifyToken, buyApiHit);

router.put("/forgotPassword", verifyToken, forgetPassword);

router.post(
  "/addPhotoProfile",
  [upload.single("file"), verifyToken],
  addPhotoProfile
);

router.put(
  "/updatePhotoProfile",
  [upload.single("file"), verifyToken],
  updatePhotoProfile
);

router.put("/deleteUsers", verifyToken, deleteUsers);

router.post("/buyTicket", verifyToken, buyTicket);

router.delete("/cancelTicket", verifyToken, cancelTicket);

router.get("/getUserTickets", verifyToken, getUserTickets);

module.exports = router;
