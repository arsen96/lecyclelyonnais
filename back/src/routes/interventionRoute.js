const express = require('express');
const router = express.Router();
const interventionController = require("../controllers/interventionController")

router.post('/save', interventionController.save);
router.get('/all', interventionController.get);
module.exports = router;
