const express = require('express');
const router = express.Router();
const bicycleController = require("../controllers/bicycleController")
const isAuthenticated = require('../middlewares/isAuthenticated');

router.post('/save', bicycleController.save);
router.get('/get', bicycleController.get);
router.get('/getUserBicycles', isAuthenticated, bicycleController.getUserBicycles);
router.post('/addNew', isAuthenticated, bicycleController.addNew);
router.post('/deleteBicycles', isAuthenticated, bicycleController.deleteBicycles);
router.post('/updateBicycle', isAuthenticated, bicycleController.updateBicycle);
module.exports = router;
