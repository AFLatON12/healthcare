const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
  username: { type: String, required: true, default: 'superadmin' },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  permissions: [{ type: String }],
}, { timestamps: true });

const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);

module.exports = SuperAdmin;
