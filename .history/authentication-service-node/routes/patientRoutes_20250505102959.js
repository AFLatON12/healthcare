const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const patientController = require('../controllers/patientController');
const { validateToken, requirePermission } = require('../middleware/authMiddleware');
const {
  PermissionPatientList,
  PermissionPatientView,
  PermissionPatientHistory,
} = require('../utils/permissions');

router.post('/register', asyncHandler(patientController.registerPatient));

// Apply authentication middleware to all routes except /register
router.use(validateToken);

// Patient Management Routes
router.get('/', requirePermission(PermissionPatientList), asyncHandler(patientController.listPatients));
router.get('/:id', requirePermission(PermissionPatientView), asyncHandler(patientController.getPatient));
router.get('/:id/history', requirePermission(PermissionPatientHistory), asyncHandler(patientController.getPatientHistory));
router.post('/:id/history', requirePermission(PermissionPatientHistory), asyncHandler(patientController.addPatientHistory));

module.exports = router;
