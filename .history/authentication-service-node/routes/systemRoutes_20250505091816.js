const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const systemController = require('../controllers/systemController');
const { validateToken, requirePermission } = require('../middleware/authMiddleware');
const {
  PermissionSystemConfig,
  PermissionSystemMetrics,
  PermissionSystemLogs,
} = require('../utils/permissions');

// Apply authentication middleware
router.use(validateToken);

// System Management Routes
router.get('/config', requirePermission(PermissionSystemConfig), asyncHandler(systemController.getSystemConfig));
router.put('/config', requirePermission(PermissionSystemConfig), asyncHandler(systemController.updateSystemConfig));
router.get('/metrics', requirePermission(PermissionSystemMetrics), asyncHandler(systemController.getSystemMetrics));
router.get('/logs', requirePermission(PermissionSystemLogs), asyncHandler(systemController.getSystemLogs));

module.exports = router;
