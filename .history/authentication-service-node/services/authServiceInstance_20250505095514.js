const AuthService = require('./authService');
const SuperAdmin = require('../models/SuperAdmin');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const env = require('../config/env');

const authServiceInstance = new AuthService({
  superAdminModel: SuperAdmin,
  adminModel: Admin,
  doctorModel: Doctor,
  patientModel: Patient,
  jwtSecret: env.JWT_SECRET || 'default_jwt_secret',
});

// Override admin permissions to use defaultAdminPermissions
authServiceInstance.getAdminPermissions = function() {
  return this.defaultAdminPermissions();
};

module.exports = authServiceInstance;

module.exports = authServiceInstance;
