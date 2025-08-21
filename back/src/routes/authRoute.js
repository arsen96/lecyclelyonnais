const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController")
const verifyToken = require("../middlewares/isAuthenticated")

/**
 * @swagger
 * /api/auth/register:
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
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
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
 *             properties:
 *               email:
 *                 type: string
 *                 example: "client@test.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Connexion réussie, token JWT retourné
 *       400:
 *         description: Email incorrect ou mot de passe incorrect
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/oauth:
 *   post:
 *     summary: Authentification OAuth
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: "client@test.com"
 *     responses:
 *       201:
 *         description: Authentification OAuth réussie
 *       400:
 *         description: L'utilisateur n'existe pas
 */
router.post('/oauth', authController.oauth);

/**
 * @swagger
 * /api/auth/forgot-password:
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
 *       500:
 *         description: Erreur lors de l'envoi de l'email
 */
router.post('/forgot-password', authController.passwordForgot);

/**
 * @swagger
 * /api/auth/reset-password:
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
 *                 example: "abc123def456789..."
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *       500:
 *         description: Token invalide ou expiré
 */
router.post('/reset-password', authController.resetPassword);

/**
 * @swagger
 * /api/auth/user:
 *   get:
 *     summary: Récupérer l'utilisateur connecté
 *     tags: [Authentification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations utilisateur récupérées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     first_name:
 *                       type: string
 *                     last_name:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [client, technician, admin, superadmin]
 *       401:
 *         description: Token manquant ou invalide
 *       500:
 *         description: Erreur lors de la récupération
 */
router.get('/user',verifyToken, authController.getConnectedUser);

module.exports = router; 