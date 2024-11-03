const express = require('express');
const router = express.Router();
const zoneController = require("../controllers/zoneController")

router.post('/save', zoneController.save);
router.get('/get', zoneController.get);
router.post('/delete', zoneController.deleteSelected);
module.exports = router;