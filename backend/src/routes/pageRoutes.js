const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");

// Importações sem chavetas e com os nomes corretos!
const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/permissionMiddleware");

// Rota GET: Pública
router.get("/home", pageController.getHomeContent);

// Rota PUT: Protegida
router.put(
  "/home",
  authMiddleware, // Aqui usamos o nome correto do teu middleware de autenticação
  checkPermission("UPDATE_CMS"),
  pageController.updateHomeContent,
);

module.exports = router;
