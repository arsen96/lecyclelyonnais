const express = require('express');
const router = express.Router();

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const interventionController = require("../controllers/interventionController")

router.post('/save', interventionController.save);
router.get('/all', interventionController.get);
// router.post('/upload-photos', interventionController.uploadOperationPhotos);
module.exports = router;
