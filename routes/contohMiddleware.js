const express = require("express");
const router = express.Router();
const {
  adminPage,
  managerPage,
  visitorPage,
  tesAPIKey,
  topup,
} = require("../controllers/contohMiddleware");
const { verifyJWT, checkRoles } = require("../middleware");
const {
  checkApiKey,
  rateLimit,
  logAccess,
  cekQuota,
  kurangiQuota,
} = require("../middleware/apiKey");

// checkRoles('admin','visitor')
// checkRoles('admin')
// checkRoles('admin','visitor','manager')
router.get("/admin", [verifyJWT, checkRoles("admin")], adminPage);
router.get(
  "/manager",
  [verifyJWT, checkRoles("admin", "manager")],
  managerPage
);
router.get(
  "/visitor",
  [verifyJWT, checkRoles("admin", "manager", "visitor")],
  visitorPage
);
router.get(
  "/tesAPIKey",
  [checkApiKey, rateLimit, logAccess, cekQuota, kurangiQuota],
  tesAPIKey
);
router.get("/topup", topup);

module.exports = router;
