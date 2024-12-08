const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middlewares/isAuthenticated');

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const interventionController = require("../controllers/interventionController")

router.post('/save',isAuthenticated, interventionController.save);
router.get('/all', interventionController.get);
router.post('/manage-end',isAuthenticated, interventionController.manageEnd);
module.exports = router;
