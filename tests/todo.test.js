const TodoModel = require('../models/todo');
describe('TodoModel', () => {
    beforeEach(() => {
        // Réinitialiser avant chaque test
    });

    test('create crée un todo avec les bonnes propriétés', () => {
        const todo = TodoModel.create(1, {
            title: 'Test todo',
            description: 'Description test'
        }); expect(todo).toHaveProperty('id');
        expect(todo.title).toBe('Test todo');
        expect(todo.userId).toBe(1);
        expect(todo.completed).toBe(false);
    });

    test('findByUserId retourne seulement les todos de l\'utilisateur', () => {
        TodoModel.create(1, { title: 'Todo 1' });
        TodoModel.create(2, { title: 'Todo 2' });
        TodoModel.create(1, { title: 'Todo 3' });

        const user1Todos = TodoModel.findByUserId(1);
        expect(user1Todos.length).toBe(2);
    });
});