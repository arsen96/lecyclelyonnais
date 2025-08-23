const express = require('express');
const router = express.Router();
const companyController = require("../controllers/companyController");
const verifyToken = require("../middlewares/isAuthenticated");
const { validateCompany } = require("../middlewares/validations/companyValidation");

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
 *               - theme_color
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Vélo Express Paris"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "contact@veloexpress.fr"
 *               subdomain:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 pattern: "^[a-zA-Z0-9]+$"
 *                 example: "veloexpress"
 *               theme_color:
 *                 type: string
 *                 pattern: "^#[0-9A-Fa-f]{6}$"
 *                 example: "#28a745"
 *               phone:
 *                 type: string
 *                 pattern: "^[0-9]{10}$"
 *                 example: "0145678910"
 *     responses:
 *       201:
 *         description: Entreprise créée avec succès
 *       400:
 *         description: Données de validation invalides ou sous-domaine déjà utilisé
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
 *                   example: "Le nom doit contenir au moins 2 caractères"
 */
router.post('/create', validateCompany, companyController.createCompany);

router.get('/get', companyController.getCompanies);
router.post('/update', validateCompany, companyController.updateCompany);
router.delete('/delete', companyController.deleteCompanies);
router.get('/current', companyController.getCurrentCompany);
router.get('/validate', companyController.validateDomain);

module.exports = router;