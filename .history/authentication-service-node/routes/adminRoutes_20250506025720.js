const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const adminController = require('../controllers/adminController');
const { validateToken, requirePermission, requireRole } = require('../middleware/authMiddleware');
const { PermissionAdminCreate, PermissionAdminList, PermissionAdminView, PermissionAdminUpdate, PermissionAdminDelete } = require('../utils/permissions');

// Apply authentication middleware
router.use(validateToken);

// Admin Management Routes
router.post('/', requirePermission(PermissionAdminCreate), asyncHandler(adminController.createAdmin));
router.get('/', requirePermission(PermissionAdminList), asyncHandler(adminController.listAdmins));
router.get('/:id', requirePermission(PermissionAdminView), asyncHandler(adminController.getAdmin));
router.put('/:id', requirePermission(PermissionAdminUpdate), asyncHandler(adminController.updateAdmin));
router.delete('/:id', requirePermission(PermissionAdminDelete), asyncHandler(adminController.deleteAdmin));
router.put('/:id/permissions', requireRole('super_admin'), asyncHandler(adminController.updateAdminPermissions));

module.exports = router;
