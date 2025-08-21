const express = require('express');
const router = express.Router();
const bicycleController = require("../controllers/bicycleController")
const isAuthenticated = require('../middlewares/isAuthenticated');

/**
 * @swagger
 * components:
 *   schemas:
 *     Bicycle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         brand:
 *           type: string
 *           example: "Giant"
 *         model:
 *           type: string
 *           example: "Escape 3"
 *         c_year:
 *           type: integer
 *           example: 2023
 *         type:
 *           type: string
 *           example: "VTT"
 *         client_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *           description: "ID du propriétaire du vélo"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-08-19T10:30:00Z"
 */

// Route save - Non documentée (usage interne uniquement)
router.post('/save', bicycleController.save);

/**
 * @swagger
 * /api/bicycles/get:
 *   get:
 *     summary: Récupérer tous les vélos
 *     tags: [Vélos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des vélos récupérée avec succès
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
 *                   example: "Bicycles récupérés avec succès"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bicycle'
 *       500:
 *         description: Erreur lors de la récupération des vélos
 */
router.get('/get', bicycleController.get);

/**
 * @swagger
 * /api/bicycles/getUserBicycles:
 *   get:
 *     summary: Récupérer les vélos de l'utilisateur connecté
 *     tags: [Vélos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vélos de l'utilisateur récupérés avec succès
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
 *                   example: "Vélos récupérés avec succès"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bicycle'
 *       500:
 *         description: Erreur lors de la récupération des vélos
 */
router.get('/getUserBicycles', isAuthenticated, bicycleController.getUserBicycles);

/**
 * @swagger
 * /api/bicycles/addNew:
 *   post:
 *     summary: Ajouter un nouveau vélo
 *     tags: [Vélos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brand
 *               - model
 *               - year
 *               - type
 *             properties:
 *               brand:
 *                 type: string
 *                 example: "Trek"
 *               model:
 *                 type: string
 *                 example: "Domane AL 2"
 *               year:
 *                 type: integer
 *                 example: 2024
 *               type:
 *                 type: string
 *                 example: "Route"
 *     responses:
 *       200:
 *         description: Vélo ajouté avec succès
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
 *                   example: "Le vélo a bien été ajouté"
 *                 data:
 *                   $ref: '#/components/schemas/Bicycle'
 *       500:
 *         description: Erreur lors de l'ajout du vélo
 */
router.post('/addNew', isAuthenticated, bicycleController.addNew);

/**
 * @swagger
 * /api/bicycles/updateBicycle:
 *   put:
 *     summary: Mettre à jour un vélo
 *     tags: [Vélos]
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
 *               - brand
 *               - model
 *               - year
 *               - type
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               brand:
 *                 type: string
 *                 example: "Specialized"
 *               model:
 *                 type: string
 *                 example: "Rockhopper 29"
 *               year:
 *                 type: integer
 *                 example: 2023
 *               type:
 *                 type: string
 *                 example: "VTT"
 *     responses:
 *       200:
 *         description: Vélo mis à jour avec succès
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
 *                   example: "Vélo mis à jour avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Bicycle'
 *       500:
 *         description: Erreur lors de la mise à jour du vélo
 */
router.post('/updateBicycle', isAuthenticated, bicycleController.updateBicycle);

/**
 * @swagger
 * /api/bicycles/deleteBicycles:
 *   delete:
 *     summary: Supprimer plusieurs vélos de l'utilisateur
 *     tags: [Vélos]
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
 *                 description: "IDs des vélos à supprimer"
 *     responses:
 *       200:
 *         description: Vélos supprimés avec succès
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
 *                   example: "2 vélo(s) supprimé(s) avec succès"
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [1, 2]
 *                     deletedCount:
 *                       type: integer
 *                       example: 2
 *                     notFoundIds:
 *                       type: array
 *                       items:
 *                         type: integer
 *                       example: [3]
 *       404:
 *         description: Aucun vélo trouvé ou permissions insuffisantes
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
 *                   example: "Aucun vélo trouvé avec les IDs fournis ou vous n'avez pas les permissions"
 *       500:
 *         description: Erreur lors de la suppression des vélos
 */
router.delete('/deleteBicycles', isAuthenticated, bicycleController.deleteBicycles);

module.exports = router;