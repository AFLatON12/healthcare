const asyncHandler = require('express-async-handler');
const authService = require('../services/authService');

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const token = await authService.login(email, password);
  res.json({ token });
});

const initializeSuperAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    await authService.initializeSuperAdmin(email, password);
    res.status(201).json({ message: 'Super admin initialized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const refreshToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  const newToken = await authService.refreshToken(token);
  res.json({ token: newToken });
});

const revokeToken = asyncHandler(async (req, res) => {
  const { token } = req.body;
  await authService.revokeToken(token);
  res.json({ message: 'Token revoked' });
});

const googleLogin = asyncHandler(async (req, res) => {
  // Implement Google login redirect logic
  res.json({ message: 'Google login - to be implemented' });
});

const googleCallback = asyncHandler(async (req, res) => {
  // Implement Google login callback logic
  res.json({ message: 'Google callback - to be implemented' });
});

const facebookLogin = asyncHandler(async (req, res) => {
  // Implement Facebook login redirect logic
  res.json({ message: 'Facebook login - to be implemented' });
});

const facebookCallback = asyncHandler(async (req, res) => {
  // Implement Facebook login callback logic
  res.json({ message: 'Facebook callback - to be implemented' });
});

module.exports = {
  login,
  initializeSuperAdmin,
  refreshToken,
  revokeToken,
  googleLogin,
  googleCallback,
  facebookLogin,
  facebookCallback,
};
