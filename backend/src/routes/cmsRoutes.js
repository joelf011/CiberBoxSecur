/**
 * Rotas do CMS (Sistema de Gestão de Conteúdos).
 *
 * Responsável por:
 * - Servir o conteúdo da página inicial ao público.
 * - Permitir a atualização do conteúdo da página inicial por administradores.
 *
 * O conteúdo é armazenado na tabela Pages, identificado pelo slug "home".
 */
const express = require("express");
const router = express.Router();
const pageController = require("../controllers/cmsController");
const authMiddleware = require("../middlewares/authMiddleware");
const checkPermission = require("../middlewares/permissionMiddleware");

// Obtém o conteúdo da página inicial (rota pública, sem autenticação).
router.get("/home", pageController.getHomeContent);

// Atualiza o conteúdo da página inicial. Exige autenticação e permissão UPDATE_CMS.
router.put(
  "/home",
  authMiddleware,
  checkPermission("UPDATE_CMS"),
  pageController.updateHomeContent,
);

module.exports = router;
