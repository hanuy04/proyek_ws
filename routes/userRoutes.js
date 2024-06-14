const express = require("express");
const {
  deleteUser,
  blockUser,
  register,
  updateProfile,
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

module.exports = router;
