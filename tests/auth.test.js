const { generateToken, authenticateToken } = require('../middleware/auth');
describe('Authentification', () => {
    test('generateToken crée un token valide', () => {
        const user = { id: 1, email: 'test@example.com' };
        const token = generateToken(user);

        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
        expect(token.split('.').length).toBe(3); // JWT format
    });

    test('authenticateToken rejette sans token', () => {
        const req = { headers: {} };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });
});
