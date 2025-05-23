const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const doctorController = require('../controllers/doctorController');
const { validateToken, requirePermission } = require('../middleware/authMiddleware');
const {
  PermissionDoctorList,
  PermissionDoctorView,
  PermissionDoctorApprove,
  PermissionDoctorReject,
  PermissionDoctorUpdate,
} = require('../utils/permissions');

// Apply authentication middleware
router.use(validateToken);

// Doctor Management Routes
router.post('/register', asyncHandler(doctorController.registerDoctor));
router.get('/', requirePermission(PermissionDoctorList), asyncHandler(doctorController.listDoctors));
router.get('/pending', requirePermission(PermissionDoctorList), asyncHandler(doctorController.listPendingDoctors));
router.get('/:id', requirePermission(PermissionDoctorView), asyncHandler(doctorController.getDoctor));
router.post('/:id/approve', requirePermission(PermissionDoctorApprove), asyncHandler(doctorController.approveDoctor));
router.post('/:id/reject', requirePermission(PermissionDoctorReject), asyncHandler(doctorController.rejectDoctor));
router.put('/:id', requirePermission(PermissionDoctorUpdate), asyncHandler(doctorController.updateDoctor));

module.exports = router;
