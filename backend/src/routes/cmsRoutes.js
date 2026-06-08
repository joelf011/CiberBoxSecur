const express = require("express");
const router = express.Router();
const pageController = require("../controllers/cmsController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/permissionMiddleware");

// Rota GET: Pública
router.get("/home", pageController.getHomeContent);

// Rota PUT: Protegida
router.put(
  "/home",
  authMiddleware,
  checkPermission("UPDATE_CMS"),
  pageController.updateHomeContent,
);

module.exports = router;
