const jwt = require('jsonwebtoken');

// Clé secrète (en production, utiliser variable d'environnement)
const SECRET_KEY = process.env.JWT_SECRET || 'votre-secret-super-securise';

/**
 * Génère un token JWT pour un utilisateur
 * @param {Object} user - Objet utilisateur {id, email}
 * @returns {string} Token JWT
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email
  };
  
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
}

/**
 * Middleware pour vérifier le token JWT
 * À utiliser sur les routes protégées
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      error: 'Token manquant',
      message: 'Vous devez être authentifié pour accéder à cette ressource'
    });
  }
  
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Token invalide',
        message: 'Votre session a expiré ou le token est invalide'
      });
    }
    
    req.user = user;
    next();
  });
}

module.exports = { generateToken, authenticateToken };