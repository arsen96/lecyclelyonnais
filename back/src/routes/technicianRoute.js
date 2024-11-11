const express = require('express');
const router = express.Router();
const technicianController = require("../controllers/technicianController")

router.post('/save', technicianController.save);
router.get('/get', technicianController.get);
router.post('/update', technicianController.update);
router.post('/delete', technicianController.deleteSelected);
module.exports = router;
