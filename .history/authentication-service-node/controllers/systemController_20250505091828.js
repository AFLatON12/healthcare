const asyncHandler = require('express-async-handler');
const systemService = require('../services/systemService');

const getSystemConfig = asyncHandler(async (req, res) => {
  const config = await systemService.getSystemConfig();
  res.json(config);
});

const updateSystemConfig = asyncHandler(async (req, res) => {
  await systemService.updateSystemConfig(req.body);
  res.json({ message: 'System config updated' });
});

const getSystemMetrics = asyncHandler(async (req, res) => {
  const metrics = await systemService.getSystemMetrics();
  res.json(metrics);
});

const getSystemLogs = asyncHandler(async (req, res) => {
  const logs = await systemService.getSystemLogs();
  res.json(logs);
});

module.exports = {
  getSystemConfig,
  updateSystemConfig,
  getSystemMetrics,
  getSystemLogs,
};
