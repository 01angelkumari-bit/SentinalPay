import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import jwt from 'jsonwebtoken';
import { hashToken, generateRandomToken, createRefreshTokenJwt, verifyRefreshTokenJwt } from '../utils/tokenUtils.js';
import { sendEmail } from '../utils/emailService.js';
import { recordAudit } from '../services/auditService.js';

const LOGIN_LOCKOUT_THRESHOLD = 5;
const LOGIN_LOCKOUT_DURATION_MINUTES = 15;

const createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION || '1h'
  });
};

const isJwtToken = (token) => typeof token === 'string' && token.split('.').length === 3;

export const createRefreshToken = async (user) => {
  const refreshToken = createRefreshTokenJwt(user._id);
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  user.refreshTokens = user.refreshTokens.filter((item) => item.expiresAt > Date.now());
  user.refreshTokens.push({ tokenHash, expiresAt });
  await user.save();

  return refreshToken;
};

export const rotateRefreshToken = async (user, refreshToken) => {
  const refreshTokenHash = hashToken(refreshToken);
  user.refreshTokens = user.refreshTokens.filter((item) => item.tokenHash !== refreshTokenHash && item.expiresAt > new Date());
  return await createRefreshToken(user);
};

export const revokeRefreshToken = async (user, refreshToken) => {
  const refreshTokenHash = hashToken(refreshToken);
  user.refreshTokens = user.refreshTokens.filter((item) => item.tokenHash !== refreshTokenHash);
  await user.save();
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000
  });
};

const getBaseUrl = () => process.env.BACKEND_URL || process.env.API_URL || 'http://localhost:5000';

export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const verificationToken = generateRandomToken();
    const emailVerificationToken = hashToken(verificationToken);
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password,
      emailVerificationToken,
      emailVerificationExpires
    });

    await Wallet.create({ userId: user._id, balance: 124589.47 });

    await recordAudit({
      actorId: user._id,
      action: 'USER_REGISTER',
      resourceType: 'User',
      resourceId: user._id,
      details: { email },
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    const verificationUrl = `${getBaseUrl()}/api/auth/verify-email/${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your SentinalPay account',
      text: `Visit ${verificationUrl} to verify your email address.`,
      html: `<p>Welcome to SentinalPay!</p><p>Verify your email by visiting <a href="${verificationUrl}">${verificationUrl}</a></p>`
    });

    res.status(201).json({ message: 'Registration successful. Check your email to verify your account.' });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      return res.status(423).json({ message: 'Account temporarily locked due to repeated failed logins' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Email not verified' });
    }

    if (!(await user.matchPassword(password))) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= LOGIN_LOCKOUT_THRESHOLD) {
        user.lockoutUntil = new Date(Date.now() + LOGIN_LOCKOUT_DURATION_MINUTES * 60 * 1000);
      }
      await user.save();

      await recordAudit({
        actorId: user._id,
        action: 'USER_LOGIN_FAILURE',
        resourceType: 'User',
        resourceId: user._id,
        details: { email, failedLoginAttempts: user.failedLoginAttempts },
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    user.lastLoginIp = req.ip;
    user.lastSeenAt = new Date();
    user.lastSeenIp = req.ip;
    user.failedLoginAttempts = 0;
    user.lockoutUntil = undefined;
    await user.save();

    const token = createAccessToken(user._id);
    const refreshToken = await createRefreshToken(user);
    setRefreshTokenCookie(res, refreshToken);

    await recordAudit({
      actorId: user._id,
      action: 'USER_LOGIN_SUCCESS',
      resourceType: 'User',
      resourceId: user._id,
      details: { email },
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const refreshTokenHash = hashToken(refreshToken);
    const user = await User.findOne({
      'refreshTokens.tokenHash': refreshTokenHash,
      'refreshTokens.expiresAt': { $gt: new Date() }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    if (isJwtToken(refreshToken)) {
      verifyRefreshTokenJwt(refreshToken);
    }

    const newRefreshToken = await rotateRefreshToken(user, refreshToken);
    setRefreshTokenCookie(res, newRefreshToken);

    await recordAudit({
      actorId: user._id,
      action: 'TOKEN_REFRESH',
      resourceType: 'User',
      resourceId: user._id,
      details: {},
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ token: createAccessToken(user._id) });
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    next(err);
  }
};

export const logoutUser = async (req, res, next) => {
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
  if (!refreshToken) {
    res.clearCookie('refreshToken');
    return res.json({ message: 'Logged out' });
  }

  try {
    const refreshTokenHash = hashToken(refreshToken);
    const user = await User.findOne({ 'refreshTokens.tokenHash': refreshTokenHash });
    if (user) {
      await revokeRefreshToken(user, refreshToken);

      await recordAudit({
        actorId: user._id,
        action: 'USER_LOGOUT',
        resourceType: 'User',
        resourceId: user._id,
        details: {},
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { token } = req.params;
  try {
    const tokenHash = hashToken(token);
    const user = await User.findOne({
      emailVerificationToken: tokenHash,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired email verification token' });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    await recordAudit({
      actorId: user._id,
      action: 'USER_EMAIL_VERIFIED',
      resourceType: 'User',
      resourceId: user._id,
      details: {},
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: 'If that email exists, a password reset link has been sent.' });
    }

    const resetToken = generateRandomToken();
    user.passwordResetToken = hashToken(resetToken);
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    await recordAudit({
      actorId: user._id,
      action: 'PASSWORD_RESET_REQUEST',
      resourceType: 'User',
      resourceId: user._id,
      details: {},
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    const resetUrl = `${getBaseUrl()}/api/auth/reset-password?token=${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset your SentinalPay password',
      text: `Reset your password at ${resetUrl}`,
      html: `<p>Reset your password by visiting <a href="${resetUrl}">${resetUrl}</a></p>`
    });

    res.json({ message: 'If that email exists, a password reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  try {
    const tokenHash = hashToken(token);
    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.refreshTokens = [];
    await user.save();

    await recordAudit({
      actorId: user._id,
      action: 'PASSWORD_RESET_COMPLETE',
      resourceType: 'User',
      resourceId: user._id,
      details: {},
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.json({ message: 'Password reset successfully. Please log in with your new password.' });
  } catch (err) {
    next(err);
  }
};
