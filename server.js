const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Logging (AVANT les routes)
const { requestLogger, errorLogger } = require('./middleware/info');
app.use(requestLogger);


// Routes
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '0.1.0'
    });
});

// Lancement du serveur
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
}
app.use(errorLogger);
module.exports = app;
