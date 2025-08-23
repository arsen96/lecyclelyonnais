const express = require('express');
const router = express.Router();
const zoneController = require("../controllers/zoneController")
const { 
    validateZone 
  } = require("../middlewares/validations/zoneValidation"); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Zone:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         zone_name:
 *           type: string
 *           example: "Zone Centre Lyon"
 *         created_at:
 *           type: string
 *           format: date
 *           example: "2025-08-19"
 *         geojson:
 *           type: object
 *           description: Coordonnées géographiques au format GeoJSON
 *           example: {"type": "Polygon", "coordinates": [[[4.8320, 45.7640], [4.8420, 45.7640], [4.8420, 45.7740], [4.8320, 45.7740], [4.8320, 45.7640]]]}
 *         technicians:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               first_name:
 *                 type: string
 *                 example: "Jean"
 *               last_name:
 *                 type: string
 *                 example: "Dupont"
 *         model_planification:
 *           type: object
 *           properties:
 *             maintenance:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 type:
 *                   type: string
 *                   example: "maintenance"
 *                 available_days:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["lundi", "mardi", "mercredi"]
 *                 slot_duration:
 *                   type: integer
 *                   example: 60
 *                 start_time:
 *                   type: string
 *                   example: "08:00"
 *                 end_time:
 *                   type: string
 *                   example: "18:00"
 *             repair:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 2
 *                 type:
 *                   type: string
 *                   example: "repair"
 *                 available_days:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["lundi", "mercredi", "vendredi"]
 *                 slot_duration:
 *                   type: integer
 *                   example: 90
 *                 start_time:
 *                   type: string
 *                   example: "09:00"
 *                 end_time:
 *                   type: string
 *                   example: "17:00"
 */

router.post('/save',validateZone, zoneController.save);
/**
 * @swagger
 * /api/zones/get:
 *   get:
 *     summary: Récupérer toutes les zones avec techniciens et plannings
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: domain
 *         required: false
 *         schema:
 *           type: string
 *           example: "lecyclelyonnais"
 *         description: Domaine de l'entreprise
 *     responses:
 *       200:
 *         description: Liste des zones récupérée avec succès
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
 *                     $ref: '#/components/schemas/Zone'
 *       500:
 *         description: Erreur lors de la récupération
 */
router.get('/get', zoneController.get);

/**
 * @swagger
 * /api/zones/update:
 *   patch:
 *     summary: Mettre à jour une zone géographique
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - zoneId
 *               - zoneTitle
 *             properties:
 *               zoneId:
 *                 type: integer
 *                 example: 1
 *               zoneTitle:
 *                 type: string
 *                 example: "Zone Centre Lyon - Mise à jour"
 *     responses:
 *       200:
 *         description: Zone mise à jour avec succès
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
 *                   example: "La zone a été mise à jour"
 *       500:
 *         description: Erreur lors de la mise à jour
 */
router.post('/update',validateZone, zoneController.updateZone);

/**
 * @swagger
 * /api/zones/delete:
 *   delete:
 *     summary: Supprimer plusieurs zones sélectionnées
 *     tags: [Zones]
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
 *                 description: IDs des zones à supprimer
 *     responses:
 *       200:
 *         description: Zones supprimées avec succès
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
 *                   example: "3 zone(s) supprimée(s) avec succès (2 technicien(s) dissocié(s))"
 *                 deletedCount:
 *                   type: integer
 *                   example: 3
 *                 dissociatedTechnicians:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Paramètres invalides
 *       404:
 *         description: Zone(s) non trouvée(s)
 *       500:
 *         description: Erreur lors de la suppression
 */
router.delete('/delete', zoneController.deleteSelected);

/**
 * @swagger
 * /api/zones/removeTechnicianFromZone:
 *   delete:
 *     summary: Retirer un technicien d'une zone
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technicianId
 *             properties:
 *               technicianId:
 *                 type: integer
 *                 example: 5
 *                 description: ID du technicien à retirer de la zone
 *     responses:
 *       200:
 *         description: Technicien retiré de la zone avec succès
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
 *                   example: "Technicien supprimé de la zone"
 *       500:
 *         description: Erreur lors de la suppression du technicien
 */
router.delete('/removeTechnicianFromZone', zoneController.removeTechnicianFromZone);

/**
 * @swagger
 * /api/zones/addTechnicianToZone:
 *   post:
 *     summary: Ajouter des techniciens à une zone avec géocodage automatique
 *     tags: [Zones]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - technician_ids
 *               - zone_id
 *             properties:
 *               technician_ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *                 description: IDs des techniciens à ajouter
 *               zone_id:
 *                 type: integer
 *                 example: 1
 *                 description: ID de la zone cible
 *     responses:
 *       200:
 *         description: Techniciens ajoutés à la zone avec succès
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
 *                   example: "Techniciens mis à jour avec succès"
 *       500:
 *         description: Erreur lors de la mise à jour des techniciens
 */
router.post('/addTechnicianToZone', zoneController.addTechnicianToZone);

/**
 * @swagger
 * /api/zones/isAddressInZone:
 *   post:
 *     summary: Vérifier si une adresse se trouve dans une zone avec technicien
 *     tags: [Zones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - address
 *             properties:
 *               address:
 *                 type: string
 *                 example: "123 rue de la République, Lyon"
 *                 description: Adresse à vérifier
 *     responses:
 *       200:
 *         description: Adresse vérifiée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: integer
 *                   example: 1
 *                   description: ID de la zone si trouvée, false sinon
 *                 message:
 *                   type: string
 *                   example: ""
 *       500:
 *         description: Adresse non couverte ou erreur de vérification
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
 *                   example: "Nous n'avons pas de technicien dans votre zone"
 */
router.post('/isAddressInZone', zoneController.isAddressInZone);

module.exports = router;