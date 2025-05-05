const asyncHandler = require('express-async-handler');
const adminService = require('../services/adminService');

const createAdmin = asyncHandler(async (req, res) => {
  const { email, password, permissions } = req.body;
  const creatorId = req.user.user_id;
  await adminService.createAdmin(creatorId, email, password, permissions);
  res.status(201).json({ message: 'Admin created' });
});

const listAdmins = asyncHandler(async (req, res) => {
  const admins = await adminService.listAdmins();
  res.json(admins);
});

const getAdmin = asyncHandler(async (req, res) => {
  const admin = await adminService.getAdmin(req.params.id);
  res.json(admin);
});

const updateAdmin = asyncHandler(async (req, res) => {
  await adminService.updateAdmin(req.params.id, req.body);
  res.json({ message: 'Admin updated' });
});

const deleteAdmin = asyncHandler(async (req, res) => {
  await adminService.deleteAdmin(req.params.id);
  res.json({ message: 'Admin deleted' });
});

const updateAdminPermissions = asyncHandler(async (req, res) => {
  const permissions = req.body.permissions;
  await adminService.updateAdminPermissions(req.params.id, permissions);
  res.json({ message: 'Admin permissions updated' });
});

module.exports = {
  createAdmin,
  listAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  updateAdminPermissions,
};
