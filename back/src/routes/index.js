const express = require('express');
const router = express.Router();

// Exemple de route générale
router.get('/', (req, res) => {
  res.send('Welcome to the API');
});

module.exports = router;