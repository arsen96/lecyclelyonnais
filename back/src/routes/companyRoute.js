const express = require('express');
const router = express.Router();
const companyController = require("../controllers/companyController");
    
router.get('/get', companyController.getCompanies);
router.post('/create', companyController.createCompany);
router.post('/update', companyController.updateCompany);
router.post('/delete', companyController.deleteCompanies);

module.exports = router;
