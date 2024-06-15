const express = require("express");
const {
  deleteUser,
  blockUser,
  register,
  updateProfile,
  topUpUser,
  buyApiHit,
  forgetPassword,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/verifyJWT");
const router = express.Router();

// Post
router.post("/register", register);

// Put
router.put("/blockUser", verifyToken, blockUser);
router.put("/updateProfile/:username", verifyToken, updateProfile);

// Delete
router.delete("/deleteUser", verifyToken, deleteUser);

router.post("/topup", verifyToken, topUpUser);

router.post("/buyApiHit", verifyToken, buyApiHit);

router.put("/forgetPassword", verifyToken, forgetPassword);

module.exports = router;
