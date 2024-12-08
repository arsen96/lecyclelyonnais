const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');
const planningModelController = require('../controllers/planningModelController');

router.post('/save',isAuthenticated, planningModelController.save);
router.get('/get',isAuthenticated, planningModelController.get);
router.put('/update/:id',isAuthenticated, planningModelController.update);
router.post('/delete',isAuthenticated, planningModelController.deleteModel);

module.exports = router;
