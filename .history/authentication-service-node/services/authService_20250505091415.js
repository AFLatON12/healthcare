const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const { promisify } = require('util');
const { ObjectId } = require('mongoose').Types;

const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

class AuthService {
  constructor({ superAdminModel, adminModel, doctorModel, patientModel, jwtSecret }) {
    this.superAdminModel = superAdminModel;
    this.adminModel = adminModel;
    this.doctorModel = doctorModel;
    this.patientModel = patientModel;
    this.jwtSecret = jwtSecret;
    this.loginAttempts = new Map();
  }

  async initializeSuperAdmin(email, password) {
    const existing = await this.superAdminModel.findOne({ email });
    if (existing) {
      throw new Error('Super admin already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdmin = new this.superAdminModel({
      username: 'superadmin',
      email,
      passwordHash: hashedPassword,
      permissions: this.defaultSuperAdminPermissions(),
    });
    await superAdmin.save();
  }

  defaultSuperAdminPermissions() {
    return ['all_permissions'];
  }

  async login(email, password) {
    if (!this.validateEmail(email)) {
      throw new Error('Invalid email format');
    }
    if (this.isAccountLocked(email)) {
      throw new Error('Account is locked due to multiple failed login attempts');
    }

    // Try super admin
    let user = await this.superAdminModel.findOne({ email });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      this.recordLoginAttempt(email, true);
      return this.generateToken(user._id, email, 'super_admin', this.defaultSuperAdminPermissions());
    }

    // Try admin
    user = await this.adminModel.findOne({ email });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      this.recordLoginAttempt(email, true);
      return this.generateToken(user._id, email, 'admin', user.permissions);
    }

    // Try doctor
    user = await this.doctorModel.findOne({ email });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      if (!user.isApproved) {
        throw new Error('Doctor account not approved');
      }
      this.recordLoginAttempt(email, true);
      return this.generateToken(user._id, email, 'doctor', ['doctor:self']);
    }

    // Try patient
    user = await this.patientModel.findOne({ email });
    if (user && await bcrypt.compare(password, user.passwordHash)) {
      if (!user.isApproved) {
        throw new Error('Patient account not approved');
      }
      this.recordLoginAttempt(email, true);
      return this.generateToken(user._id, email, 'patient', ['patient:self', 'patient:view']);
    }

    this.recordLoginAttempt(email, false);
    throw new Error('Invalid email or password');
  }

  validateEmail(email) {
    const emailRegex = /^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/;
    return emailRegex.test(email);
  }

  isAccountLocked(email) {
    const attempts = this.loginAttempts.get(email) || [];
    if (attempts.length < 5) return false;

    const fifteenMinutesAgo = Date.now() - 15 * 60 * 1000;
    const recentFailures = attempts.slice(-5).filter(a => !a.success && a.timestamp > fifteenMinutesAgo).length;
    return recentFailures >= 5;
  }

  recordLoginAttempt(email, success) {
    const attempts = this.loginAttempts.get(email) || [];
    if (attempts.length >= 10) {
      attempts.shift();
    }
    attempts.push({ email, timestamp: Date.now(), success });
    this.loginAttempts.set(email, attempts);
  }

  generateToken(userId, email, role, permissions) {
    let expiration;
    switch (role) {
      case 'super_admin':
        expiration = '24h';
        break;
      case 'admin':
        expiration = '12h';
        break;
      case 'doctor':
        expiration = '8h';
        break;
      case 'patient':
        expiration = '4h';
        break;
      default:
        expiration = '1h';
    }

    const payload = {
      user_id: userId.toString(),
      email,
      role,
      permissions,
    };

    return jwt.sign(payload, this.jwtSecret, { expiresIn: expiration });
  }

  async refreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return this.generateToken(decoded.user_id, decoded.email, decoded.role, decoded.permissions);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async revokeToken(token) {
    // Implement token revocation logic if needed (e.g., blacklist in Redis)
    return;
  }
}

module.exports = AuthService;
