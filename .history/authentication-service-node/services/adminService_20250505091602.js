const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

class AdminService {
  async createAdmin(creatorId, email, password) {
    if (!email.includes('@')) {
      throw new Error('Invalid email format');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const username = email.substring(0, email.indexOf('@'));
    const admin = new Admin({
      username,
      email,
      passwordHash: hashedPassword,
      createdBy: creatorId,
      permissions: this.defaultAdminPermissions(),
    });
    await admin.save();
  }

  defaultAdminPermissions() {
    return ['admin:create', 'admin:list', 'admin:view', 'admin:update', 'admin:delete'];
  }

  async listAdmins() {
    return Admin.find();
  }

  async getAdmin(adminId) {
    return Admin.findById(adminId);
  }

  async updateAdmin(adminId, updateData) {
    return Admin.findByIdAndUpdate(adminId, updateData, { new: true });
  }

  async deleteAdmin(adminId) {
    return Admin.findByIdAndDelete(adminId);
  }

  async updateAdminPermissions(adminId, permissions) {
    return Admin.findByIdAndUpdate(adminId, { permissions }, { new: true });
  }
}

module.exports = new AdminService();
