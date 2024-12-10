const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/isAuthenticated');
const clientController = require('../controllers/clientController');

router.get('/clients', authMiddleware, clientController.getClients);
router.put('/clients/:id', authMiddleware, clientController.updateClient);
router.post('/clients/delete', authMiddleware, clientController.deleteClient);

module.exports = router;