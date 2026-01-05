const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Routes filters
const filterRoutes = require('./routes/filters');
app.use('/api/filters', filterRoutes);

app.use(express.json());

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

