const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const { authenticateToken } = require('./middleware/auth');
const authRoutes = require('./routes/auth');
// Routes d'authentification
app.use('/api/auth', authRoutes);
// Route protégée de test
app.get('/api/protected', authenticateToken, (req, res) => {
res.json({
message: 'Vous avez accès à cette route protégée',
user: req.user
});
});

// Route de base
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '0.1.0'
    });
});

// Export pour les tests
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
}

module.exports = app;

