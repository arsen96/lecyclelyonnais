const express = require('express');
const router = express.Router();
const technicianController = require("../controllers/technicianController")

/**
 * @swagger
 * components:
 *   schemas:
 *     Technician:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         first_name:
 *           type: string
 *           example: "Jean"
 *         last_name:
 *           type: string
 *           example: "Dupont"
 *         email:
 *           type: string
 *           format: email
 *           example: "jean.dupont@lecyclelyonnais.fr"
 *         phone:
 *           type: string
 *           example: "0123456789"
 *         address:
 *           type: string
 *           example: "123 rue de la République, Lyon"
 *         geographical_zone_id:
 *           type: integer
 *           nullable: true
 *           example: 1
 *           description: "ID de la zone géographique (déterminé automatiquement par géocodage)"
 *         company_id:
 *           type: integer
 *           example: 1
 *         created_at:
 *           type: string
 *           format: date
 *           example: "2025-08-19"
 */

/**
 * @swagger
 * /api/technicians/get:
 *   get:
 *     summary: Récupérer tous les techniciens
 *     tags: [Techniciens]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des techniciens récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Technician'
 *       500:
 *         description: Erreur lors de la récupération des techniciens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error fetching technicians"
 */
router.get('/get', technicianController.get);

/**
 * @swagger
 * /api/technicians/save:
 *   post:
 *     summary: Créer un nouveau technicien
 *     tags: [Techniciens]
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
 *               - phone
 *               - address
 *               - domain
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
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               address:
 *                 type: string
 *                 example: "456 avenue de la Liberté, Lyon"
 *                 description: "Adresse géocodée automatiquement pour déterminer la zone"
 *               domain:
 *                 type: string
 *                 example: "lecyclelyonnais"
 *                 description: "Domaine de l'entreprise"
 *     responses:
 *       201:
 *         description: Technicien créé avec succès
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
 *                   example: "Technicien créé avec succès"
 *       400:
 *         description: Email déjà utilisé ou erreur de validation
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
 *                   example: "Cet email est déjà utilisé"
 *       500:
 *         description: Erreur lors de la création du technicien
 */
router.post('/save', technicianController.save);

/**
 * @swagger
 * /api/technicians/update:
 *   patch:
 *     summary: Mettre à jour un technicien existant
 *     tags: [Techniciens]
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
 *               - phone
 *               - address
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
 *               phone:
 *                 type: string
 *                 example: "0987654321"
 *               address:
 *                 type: string
 *                 example: "456 avenue de la Liberté, Lyon"
 *                 description: "Adresse géocodée automatiquement pour déterminer la zone"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "nouveaumotdepasse123"
 *                 description: "Optionnel - laissez vide pour ne pas changer le mot de passe"
 *     responses:
 *       200:
 *         description: Technicien mis à jour avec succès
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
 *                   example: "Technicien mis à jour avec succès"
 *       404:
 *         description: Technicien non trouvé
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
 *                   example: "Technicien non trouvé"
 *       500:
 *         description: Erreur lors de la mise à jour
 */
router.post('/update', technicianController.update);

/**
 * @swagger
 * /api/technicians/delete:
 *   delete:
 *     summary: Supprimer plusieurs techniciens
 *     tags: [Techniciens]
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
 *                 description: "IDs des techniciens à supprimer"
 *     responses:
 *       200:
 *         description: Techniciens supprimés avec succès
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
 *                   example: "Les techniciens ont été supprimés"
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
 *                   example: "2 technicien(s) supprimé(s) sur 3 demandé(s)"
 *       400:
 *         description: Technicien lié à des interventions
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
 *                   example: "Ce technicien est lié à une intervention"
 *       404:
 *         description: Aucun technicien trouvé
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
 *                   example: "Aucun technicien trouvé avec ces IDs"
 *       500:
 *         description: Erreur lors de la suppression
 */
router.delete('/delete', technicianController.deleteSelected);

module.exports = router;