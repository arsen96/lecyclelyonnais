const express = require('express');
const router = express.Router();
const zoneController = require("../controllers/zoneController")

router.post('/save', zoneController.save);
router.get('/get', zoneController.get);
router.post('/update', zoneController.updateZone);
router.post('/delete', zoneController.deleteSelected);
router.post('/removeTechnicianFromZone', zoneController.removeTechnicianFromZone);
router.post('/addTechnicianToZone', zoneController.addTechnicianToZone);
router.post('/isAddressInZone', zoneController.isAddressInZone);
module.exports = router;
