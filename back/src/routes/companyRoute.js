const express = require('express');
const router = express.Router();
const companyController = require("../controllers/companyController");
const verifyToken = require("../middlewares/isAuthenticated")

/**
 * @swagger
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Le Cycle Lyonnais"
 *         email:
 *           type: string
 *           format: email
 *           example: "contact@lecyclelyonnais.fr"
 *         subdomain:
 *           type: string
 *           example: "lecyclelyonnais"
 *         theme_color:
 *           type: string
 *           example: "#007bff"
 *         phone:
 *           type: string
 *           example: "0123456789"
 *         created_at:
 *           type: string
 *           format: date
 *           example: "2025-08-19"
 */

/**
 * @swagger
 * /api/companies/get:
 *   get:
 *     summary: Récupérer toutes les entreprises ou une entreprise spécifique
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: false
 *         schema:
 *           type: string
 *           example: "lecyclelyonnais"
 *         description: Domaine pour filtrer une entreprise spécifique (optionnel)
 *     responses:
 *       200:
 *         description: Liste des entreprises récupérée avec succès
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
 *                     $ref: '#/components/schemas/Company'
 *       500:
 *         description: Erreur lors de la récupération des entreprises
 */
router.get('/get', companyController.getCompanies);

/**
 * @swagger
 * /api/companies/create:
 *   post:
 *     summary: Créer une nouvelle entreprise
 *     tags: [Entreprises]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - subdomain
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vélo Express Paris"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "contact@veloexpress.fr"
 *               subdomain:
 *                 type: string
 *                 example: "veloexpress"
 *               theme_color:
 *                 type: string
 *                 example: "#28a745"
 *               phone:
 *                 type: string
 *                 example: "0145678910"
 *     responses:
 *       201:
 *         description: Entreprise créée avec succès
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
 *                   example: "Entreprise créée avec succès"
 *       400:
 *         description: Sous-domaine ou email déjà utilisé
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
 *                   example: "Un sous-domaine est deja enregistré avec ce email"
 *       500:
 *         description: Erreur lors de la création de l'entreprise
 */
router.post('/create', companyController.createCompany);

/**
 * @swagger
 * /api/companies/update:
 *   post:
 *     summary: Mettre à jour une entreprise existante
 *     tags: [Entreprises]
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
 *               - name
 *               - email
 *               - subdomain
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Le Cycle Lyonnais - Mise à jour"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "nouveau@lecyclelyonnais.fr"
 *               subdomain:
 *                 type: string
 *                 example: "lecyclelyonnais"
 *               theme_color:
 *                 type: string
 *                 example: "#dc3545"
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *     responses:
 *       200:
 *         description: Entreprise mise à jour avec succès
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
 *                   example: "Entreprise mise à jour avec succès"
 *       404:
 *         description: Entreprise non trouvée
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
 *                   example: "Entreprise non trouvée"
 *       500:
 *         description: Erreur lors de la mise à jour de l'entreprise
 */
router.post('/update', companyController.updateCompany);

/**
 * @swagger
 * /api/companies/delete:
 *   delete:
 *     summary: Supprimer plusieurs entreprises
 *     tags: [Entreprises]
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
 *                 description: IDs des entreprises à supprimer
 *     responses:
 *       200:
 *         description: Entreprises supprimées avec succès
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
 *                   example: "Les entreprises ont été supprimées"
 *       207:
 *         description: Suppression partielle
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
 *                   example: "2 entreprise(s) supprimée(s) sur 3 demandée(s)"
 *       400:
 *         description: Entreprise liée à d'autres entités
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
 *                   example: "Cette entreprise est liée à une autre entité"
 *       404:
 *         description: Aucune entreprise trouvée
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
 *                   example: "Aucune entreprise trouvée avec ces IDs"
 *       500:
 *         description: Erreur lors de la suppression des entreprises
 */
router.delete('/delete', companyController.deleteCompanies);

router.get('/current', companyController.getCurrentCompany);
router.get('/validate', companyController.validateDomain);

module.exports = router;