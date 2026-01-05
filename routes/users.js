const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');
const { authenticateToken } = require('../middleware/auth');
/**
* POST /api/users/register
* Inscription d'un nouvel utilisateur
* Route publique (pas besoin d'auth)
*/
router.post('/register', (req, res) => {
 const { email, password, name } = req.body;

 // Validation
 if (!email || !password) {
 return res.status(400).json({
 error: 'Email et mot de passe requis'
 });
 }

 // Validation email basique
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!emailRegex.test(email)) {
 return res.status(400).json({
 error: 'Format email invalide'
 });
 }

 // Validation mot de passe (min 6 caractères)
 if (password.length < 6){
 return res.status(400).json({
 error: 'Le mot de passe doit contenir au moins 6 caractères'
 });
 }

 try {
 const user = UserModel.create({ email, password, name });

 res.status(201).json({
 message: 'Utilisateur créé avec succès',
 user
 });
 } catch (error) {
 res.status(409).json({
 error: error.message
 });
 }
});
/**
* GET /api/users/me
* Récupérer le profil de l'utilisateur connecté
*/
router.get('/me', authenticateToken, (req, res) => {
 const user = UserModel.findById(req.user.id);

 if (!user) {
 return res.status(404).json({
 error: 'Utilisateur non trouvé'
 });
 }

 res.json(user);
});
/**
* PUT /api/users/me
* Mettre à jour son profil
*/
router.put('/me', authenticateToken, (req, res) => {
 const { name, email, password } = req.body;

 try {
 const user = UserModel.update(req.user.id, { name, email, password });

 if (!user) {
 return res.status(404).json({
 error: 'Utilisateur non trouvé'
 });
 }

 res.json({
 message: 'Profil mis à jour',
 user
 });
 } catch (error) {
 res.status(400).json({
 error: error.message
 });
 }
});
/**
* DELETE /api/users/me
* Supprimer son compte
*/
router.delete('/me', authenticateToken, (req, res) => {
 const deleted = UserModel.delete(req.user.id);

 if (!deleted) {
 return res.status(404).json({
 error: 'Utilisateur non trouvé'
 });
 }

 res.json({
 message: 'Compte supprimé avec succès'
 });
});
/**
* GET /api/users
* Liste de tous les utilisateurs (pour l'admin)
*/
router.get('/', authenticateToken, (req, res) => {
 const users = UserModel.getAll();

 res.json({
 count: users.length,
 users
 });
});
module.exports = router;
