const express = require('express');
const router = express.Router();
const bicycleController = require("../controllers/bicycleController")

router.post('/save', bicycleController.save);
router.get('/get', bicycleController.get);
module.exports = router;
