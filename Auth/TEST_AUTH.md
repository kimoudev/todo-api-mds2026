# Tests Authentification
## Test 1 : Login réussi
**Requête :**
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"alice@example.com","password":"password123"}'
```
**Résultat attendu :**
```json
{
"message": "Connexion réussie",
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": 1,
"email": "alice@example.com"
}
}
```
## Test 2 : Login échoué
**Requête :**
```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"wrong@example.com","password":"wrong"}'
```
**Résultat attendu :**
```json
{
"error": "Identifiants invalides"
}
```
## Test 3 : Accès route protégée
**Requête :**
```bash
curl http://localhost:3000/api/protected \
-H "Authorization: Bearer VOTRE_TOKEN_ICI"