const express = require("express");
const router = express.Router();
const { generateToken } = require("../middleware/auth");
// Base de données simulée (en production: vraie DB)
const users = [
  { id: 1, email: "alice@example.com", password: "password123" },
  { id: 2, email: "bob@example.com", password: "password456" },
];
/**
 * POST /api/auth/login
 * Connexion utilisateur
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validation des données
  if (!email || !password) {
    return res.status(400).json({
      error: "Données manquantes",
      message: "Email et mot de passe requis",
    });
  }

  // Chercher l'utilisateur
  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    return res.status(401).json({
      error: "Identifiants invalides",
      message: "Email ou mot de passe incorrect",
    });
  }

  // Générer le token
  const token = generateToken({ id: user.id, email: user.email });

  res.json({
    message: "Connexion réussie",
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
});
/**
 * POST /api/auth/verify
 * Vérifier si un token est valide
 */
router.post("/verify", (req, res) => {
  // Cette route sera protégée dans server.js
  res.json({
    message: "Token valide",
    user: req.user,
  });
});
module.exports = router;
