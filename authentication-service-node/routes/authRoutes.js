const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const authController = require('../controllers/authController');

// Public Authentication Routes
router.post('/login', asyncHandler(authController.login));
router.post('/initialize-super-admin', asyncHandler(authController.initializeSuperAdmin));
router.post('/refresh', asyncHandler(authController.refreshToken));
router.post('/revoke', asyncHandler(authController.revokeToken));
router.get('/google', asyncHandler(authController.googleLogin));
router.get('/google/callback', asyncHandler(authController.googleCallback));
router.get('/facebook', asyncHandler(authController.facebookLogin));
router.get('/facebook/callback', asyncHandler(authController.facebookCallback));

module.exports = router;
