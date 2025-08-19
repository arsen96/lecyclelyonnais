/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription client
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - domain
 *             properties:
 *               email:
 *                 type: string
 *                 example: "client@test.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               firstName:
 *                 type: string
 *                 example: "Jean"
 *               lastName:
 *                 type: string
 *                 example: "Dupont"
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *               address:
 *                 type: string
 *                 example: "123 rue de la République, Lyon"
 *               domain:
 *                 type: string
 *                 example: "lecyclelyonnais"
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       400:
 *         description: Email déjà utilisé ou entreprise non reconnue
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur (Client ou Technicien)
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - domain
 *             properties:
 *               email:
 *                 type: string
 *                 example: "client@test.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               domain:
 *                 type: string
 *                 example: "lecyclelyonnais"
 *     responses:
 *       201:
 *         description: Connexion réussie, token JWT retourné
 *       400:
 *         description: Email incorrect ou mot de passe incorrect
 */

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Demande de réinitialisation mot de passe
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - domain
 *             properties:
 *               email:
 *                 type: string
 *                 example: "client@test.com"
 *               domain:
 *                 type: string
 *                 example: "lecyclelyonnais"
 *     responses:
 *       200:
 *         description: Email de réinitialisation envoyé
 *       404:
 *         description: Adresse email non trouvée
 */

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - token
 *             properties:
 *               password:
 *                 type: string
 *                 example: "nouveauMotDePasse123"
 *               token:
 *                 type: string
 *                 example: "abc123def456..."
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       500:
 *         description: Token invalide ou expiré
 */