const express = require('express'); 
const router = express.Router(); 
const TodoModel = require('../models/todo'); 
const { authenticateToken } = require('../middleware/auth'); 
// Toutes les routes sont protégées 
router.use(authenticateToken); 
/** 
* GET /api/todos 
* Récupérer tous les todos de l'utilisateur connecté 
*/ 
router.get('/', (req, res) => { 
const todos = TodoModel.findByUserId(req.user.id); 
res.json({ 
count: todos.length, 
todos 
}); 
}); 
/** 
* GET /api/todos/:id 
* Récupérer un todo spécifique 
*/ 
router.get('/:id', (req, res) => { 
    const todo = TodoModel.findById(req.params.id, req.user.id); 
     
    if (!todo) { 
        return res.status(404).json({  
            error: 'Todo non trouvé'  
        }); 
    } 
     
    res.json(todo); 
}); 
 
/** 
 * POST /api/todos 
 * Créer un nouveau todo 
 */ 
router.post('/', (req, res) => { 
    const { title, description, priority } = req.body; 
     
    // Validation 
    if (!title || title.trim() === '') { 
        return res.status(400).json({  
            error: 'Le titre est requis'  
        }); 
    } 
     
    if (priority && !['low', 'medium', 'high'].includes(priority)) { 
        return res.status(400).json({  
            error: 'Priorité invalide (low, medium, high)'  
        }); 
    } 
     
    // Créer le todo 
    const todo = TodoModel.create(req.user.id, { title, description, priority }); 
     
    res.status(201).json({ 
        message: 'Todo créé avec succès', 
        todo 
    }); 
}); 
 
/** 
 * PUT /api/todos/:id 
 * Mettre à jour un todo 
 */ 
router.put('/:id', (req, res) => { 
    const { title, description, completed, priority } = req.body; 
     
    // Validation de la priorité si fournie 
    if (priority && !['low', 'medium', 'high'].includes(priority)) { 
        return res.status(400).json({  
            error: 'Priorité invalide'  
        }); 
    } 
     
    const todo = TodoModel.update(req.params.id, req.user.id, { 
        title, 
        description, 
        completed, 
        priority 
    }); 
     
    if (!todo) { 
        return res.status(404).json({  
            error: 'Todo non trouvé'  
        }); 
    } 
     
    res.json({ 
        message: 'Todo mis à jour', 
        todo 
    }); 
}); 
 
/** 
 * DELETE /api/todos/:id 
 * Supprimer un todo 
 */ 
router.delete('/:id', (req, res) => { 
    const deleted = TodoModel.delete(req.params.id, req.user.id); 
     
    if (!deleted) { 
        return res.status(404).json({  
            error: 'Todo non trouvé'  
        }); 
    } 
     
    res.status(204).send(); 
}); 
 
/** 
 * PATCH /api/todos/:id/toggle 
 * Basculer l'état completed d'un todo 
 */ 
router.patch('/:id/toggle', (req, res) => { 
    const todo = TodoModel.findById(req.params.id, req.user.id); 
     
    if (!todo) { 
        return res.status(404).json({ error: 'Todo non trouvé' }); 
    } 
     
    const updated = TodoModel.update(req.params.id, req.user.id, { 
        completed: !todo.completed 
    }); 
     
    res.json({ 
        message: `Todo marqué comme ${updated.completed ? 'terminé' : 'en cours'}`, 
        todo: updated 
    }); 
}); 
 
module.exports = router;