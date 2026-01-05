const express = require('express');
const router = express.Router();
const TodoModel = require('../models/todo');
const { authenticateToken } = require('../middleware/auth');

// Toutes les routes protégées
router.use(authenticateToken);

/**
 * GET /api/filters/completed
 * Récupérer uniquement les todos terminés
 */
router.get('/completed', (req, res) => {
  const todos = TodoModel.findByUserId(req.user.id);
  const completed = todos.filter(t => t.completed);

  res.json({
    count: completed.length,
    todos: completed
  });
});

/**
 * GET /api/filters/active
 * Récupérer uniquement les todos actifs (non terminés)
 */
router.get('/active', (req, res) => {
  const todos = TodoModel.findByUserId(req.user.id);
  const active = todos.filter(t => !t.completed);

  res.json({
    count: active.length,
    todos: active
  });
});

/**
 * GET /api/filters/priority/:level
 * Filtrer par priorité (low, medium, high)
 */
router.get('/priority/:level', (req, res) => {
  const { level } = req.params;

  if (!['low', 'medium', 'high'].includes(level)) {
    return res.status(400).json({
      error: 'Niveau de priorité invalide (low, medium, high)'
    });
  }

  const todos = TodoModel.findByUserId(req.user.id);
  const filtered = todos.filter(t => t.priority === level);

  res.json({
    priority: level,
    count: filtered.length,
    todos: filtered
  });
});

/**
 * GET /api/filters/search?q=...
 * Rechercher dans les titres et descriptions
 */
router.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({
      error: 'Paramètre de recherche manquant (q)'
    });
  }

  const todos = TodoModel.findByUserId(req.user.id);
  const searchTerm = q.toLowerCase();

  const results = todos.filter(t =>
    t.title.toLowerCase().includes(searchTerm) ||
    (t.description && t.description.toLowerCase().includes(searchTerm))
  );

  res.json({
    query: q,
    count: results.length,
    todos: results
  });
});

/**
 * GET /api/filters/stats
 * Statistiques sur les todos
 */
router.get('/stats', (req, res) => {
  const todos = TodoModel.findByUserId(req.user.id);

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    byPriority: {
      high: todos.filter(t => t.priority === 'high').length,
      medium: todos.filter(t => t.priority === 'medium').length,
      low: todos.filter(t => t.priority === 'low').length
    },
    completionRate: todos.length > 0
      ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100)
      : 0
  };

  res.json(stats);
});

module.exports = router;
