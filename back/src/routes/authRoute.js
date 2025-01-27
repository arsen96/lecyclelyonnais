const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController")
const verifyToken = require("../middlewares/isAuthenticated")

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/oauth', authController.oauth);
router.post('/forgot-password', authController.passwordForgot);
router.post('/reset-password', authController.resetPassword);
router.get('/user',verifyToken, authController.getConnectedUser);

module.exports = router;
