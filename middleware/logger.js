const fs = require('fs');
const path = require('path');

// Créer le dossier logs s'il n'existe pas
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

/**
 * Middleware de logging des requêtes HTTP
 */
function requestLogger(req, res, next) {
  const start = Date.now();
  
  // Capturer la fin de la requête
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent') || 'unknown'
    };

    // Log console
    const statusColor = res.statusCode >= 500 ? '\x1b[31m' : // Rouge pour erreurs serveur
                       res.statusCode >= 400 ? '\x1b[33m' : // Jaune pour erreurs client
                                               '\x1b[32m';  // Vert pour succès
    
    console.log(
      `${statusColor}${log.method}\x1b[0m ${log.url} ` +
      `${statusColor}${log.status}\x1b[0m ${log.duration}`
    );

    // Log fichier
    const logFile = path.join(logsDir, 'access.log');
    fs.appendFileSync(logFile, JSON.stringify(log) + '\n');
  });

  next();
}

/**
 * Middleware pour logger les erreurs
 */
function errorLogger(err, req, res, next) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    error: {
      message: err.message,
      stack: err.stack
    }
  };

  // Log console
  console.error('\x1b[31m[ERROR]\x1b[0m', err.message);

  // Log fichier
  const errorFile = path.join(logsDir, 'errors.log');
  fs.appendFileSync(errorFile, JSON.stringify(errorLog) + '\n');

  // Passer au handler d'erreur suivant
  next(err);
}

module.exports = {
  requestLogger,
  errorLogger
};