const express = require('express');
const router = express.Router();

// Static permissions list
const permissionsList = [
  'admin:create',
  'admin:list',
  'admin:view',
  'admin:update',
  'admin:delete',
  'doctor:list',
  'doctor:view',
  'doctor:approve',
  'doctor:reject',
  'doctor:delete',
  'patient:create',
  'patient:delete',
  'patient:list',
  'patient:view',
  'system:config',
  'system:metrics',
  'system:logs',
];

// GET /api/v1/permissions
router.get('/', (req, res) => {
  res.json(permissionsList);
});

module.exports = router;
