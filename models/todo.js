let todos=[];
let nextId = 1;

/** 
* Structure d'un Todo: 
* { 
 *   id: number, 
 *   userId: number, 
 *   title: string, 
 *   description: string, 
 *   completed: boolean, 
 *   priority: 'low' | 'medium' | 'high', 
 *   createdAt: Date, 
 *   updatedAt: Date 
 * } 
 */ 

class TodoModel { 
    /** 
     * Créer un nouveau todo 
     */ 
    static create(userId, data) { 
        const todo = { 
            id: nextId++, 
            userId, 
            title: data.title, 
            description: data.description || '', 
            completed: false, 
            priority: data.priority || 'medium', 
            createdAt: new Date(), 
            updatedAt: new Date() 
        }; 
         
        todos.push(todo); 
        return todo; 
    } 
     
    /** 
     * Récupérer tous les todos d'un utilisateur 
     */ 
    static findByUserId(userId) { 
        return todos.filter(t => t.userId === userId); 
    } 
     
    /** 
     * Récupérer un todo par ID 
     */ 
    static findById(id, userId) { 
        return todos.find(t => t.id === parseInt(id) && t.userId === userId); 
    } 
     
    /** 
     * Mettre à jour un todo 
     */ 
    static update(id, userId, data) { 
        const todo = this.findById(id, userId); 
        if (!todo) return null; 
         
        // Mettre à jour seulement les champs fournis 
        if (data.title !== undefined) todo.title = data.title; 
        if (data.description !== undefined) todo.description = data.description; 
        if (data.completed !== undefined) todo.completed = data.completed; 
        if (data.priority !== undefined) todo.priority = data.priority; 
         
        todo.updatedAt = new Date(); 
        return todo; 
    } 
     
    /** 
     * Supprimer un todo 
     */ 
    static delete(id, userId) { 
        const index = todos.findIndex(t => t.id === parseInt(id) && t.userId === userId); 
        if (index === -1) return false; 
         
        todos.splice(index, 1); 
        return true; 
    } 
     
    /** 
     * Compter les todos d'un utilisateur 
     */ 
    static count(userId) { 
        return this.findByUserId(userId).length; 
} 
} 
module.exports = TodoModel;