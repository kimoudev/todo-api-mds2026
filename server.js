const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
// Logging
const { requestLogger, errorLogger } = require('./middleware/logger');

app.use(express.json());
app.use(requestLogger);

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
app.use(errorLogger);

module.exports = app;

