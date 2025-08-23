const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController")
const isAuthenticated = require('../middlewares/isAuthenticated');
const { 
    validateAdminCreation, 
    validateAdminUpdate, 
    validateAdminLogin 
  } = require("../middlewares/validations/adminValidation"); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Administrator:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         first_name:
 *           type: string
 *           example: "Marie"
 *         last_name:
 *           type: string
 *           example: "Dubois"
 *         email:
 *           type: string
 *           format: email
 *           example: "marie.dubois@lecyclelyonnais.fr"
 *         role:
 *           type: string
 *           enum: [admin, superadmin]
 *           example: "admin"
 *         company_id:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-08-19T10:30:00Z"
 */

/**
 * @swagger
 * /api/admins/get:
 *   get:
 *     summary: Récupérer tous les administrateurs
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des administrateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Administrator'
 *       500:
 *         description: Erreur lors de la récupération des administrateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la récupération des admins"
 */
router.get('/get', isAuthenticated, adminController.getAdmins);

/**
 * @swagger
 * /api/admins/create:
 *   post:
 *     summary: Créer un nouvel administrateur
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - email
 *               - password
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "Pierre"
 *               last_name:
 *                 type: string
 *                 example: "Martin"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "pierre.martin@lecyclelyonnais.fr"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "motdepasse123"
 *               domain:
 *                 type: string
 *                 example: "lecyclelyonnais"
 *                 description: "Domaine de l'entreprise (alternatif à company_id)"
 *               company_id:
 *                 type: integer
 *                 example: 1
 *                 description: "ID de l'entreprise (alternatif à domain)"
 *     responses:
 *       200:
 *         description: Administrateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin créé avec succès"
 *       400:
 *         description: Email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Un utilisateur avec cet email existe déjà"
 *       500:
 *         description: Erreur lors de la création
 */
router.post('/create', isAuthenticated, validateAdminCreation, adminController.createAdmin);

/**
 * @swagger
 * /api/admins/update:
 *   put:
 *     summary: Mettre à jour un administrateur existant
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - first_name
 *               - last_name
 *               - email
 *               - role
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               first_name:
 *                 type: string
 *                 example: "Pierre"
 *               last_name:
 *                 type: string
 *                 example: "Martin"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "pierre.martin@lecyclelyonnais.fr"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "nouveaumotdepasse123"
 *                 description: "Optionnel - laissez vide pour ne pas changer le mot de passe"
 *               role:
 *                 type: string
 *                 enum: [admin, superadmin]
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Administrateur mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin mis à jour avec succès"
 *       400:
 *         description: Email déjà utilisé par un autre utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Un autre utilisateur avec cet email existe déjà"
 *       500:
 *         description: Erreur lors de la mise à jour
 */
router.post('/update', isAuthenticated, validateAdminUpdate, adminController.updateAdmin);

/**
 * @swagger
 * /api/admins/delete:
 *   delete:
 *     summary: Supprimer plusieurs administrateurs
 *     tags: [Administrateurs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *                 description: "IDs des administrateurs à supprimer"
 *     responses:
 *       200:
 *         description: Administrateurs supprimés avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admins supprimés avec succès"
 *       500:
 *         description: Erreur lors de la suppression
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la suppression des admins"
 */
router.post('/delete', isAuthenticated, adminController.deleteAdmin);

router.post('/login',validateAdminLogin, adminController.loginAdmin);

module.exports = router;