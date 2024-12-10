const express = require('express');
const router = express.Router();
const adminController = require("../controllers/adminController")
const isAuthenticated = require('../middlewares/isAuthenticated');

router.get('/get', isAuthenticated, adminController.getAdmins);
router.post('/create', isAuthenticated, adminController.createAdmin);
router.post('/update', isAuthenticated, adminController.updateAdmin);
router.post('/delete', isAuthenticated, adminController.deleteAdmin);
router.post('/login', adminController.loginAdmin);

module.exports = router;