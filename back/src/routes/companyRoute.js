const express = require('express');
const router = express.Router();
const companyController = require("../controllers/companyController");
const verifyToken = require("../middlewares/isAuthenticated")


router.get('/get', companyController.getCompanies);
router.post('/create', companyController.createCompany);
router.get('/current', companyController.getCurrentCompany);
router.get('/validate', companyController.validateDomain);
router.post('/update', companyController.updateCompany);
router.post('/delete', companyController.deleteCompanies);

module.exports = router;
