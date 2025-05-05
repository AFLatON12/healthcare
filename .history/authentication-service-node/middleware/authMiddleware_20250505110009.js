const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);

const validateToken = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Check if token is blacklisted
      const isBlacklisted = await getAsync(`blacklist_${token}`);
      if (isBlacklisted) {
        res.status(401);
        throw new Error('Not authorized, token revoked');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      res.status(403);
      throw new Error('Forbidden: insufficient role');
    }
    next();
  };
};

const requirePermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Unauthorized');
    }
    if (req.user.role === 'super_admin') {
      return next();
    }
    if (!req.user.permissions || !req.user.permissions.includes(requiredPermission)) {
      res.status(403);
      throw new Error('Forbidden: insufficient permissions');
    }
    next();
  };
};

module.exports = { validateToken, requireRole, requirePermission };
