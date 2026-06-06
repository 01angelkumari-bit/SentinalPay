import express from 'express';
import { body, param } from 'express-validator';
import { registerUser, loginUser, refreshToken, logoutUser, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

const emailValidation = body('email').isEmail().withMessage('Valid email is required').normalizeEmail();
const passwordValidation = body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters');

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    emailValidation,
    passwordValidation
  ],
  validateRequest,
  registerUser
);

router.post(
  '/login',
  authLimiter,
  [
    emailValidation,
    passwordValidation
  ],
  validateRequest,
  loginUser
);

router.post(
  '/refresh-token',
  [body('refreshToken').optional().isString().withMessage('Refresh token must be a string')],
  validateRequest,
  refreshToken
);

router.post(
  '/logout',
  [body('refreshToken').optional().isString().withMessage('Refresh token must be a string')],
  validateRequest,
  logoutUser
);

router.get(
  '/verify-email/:token',
  [param('token').notEmpty().withMessage('Verification token is required')],
  validateRequest,
  verifyEmail
);

router.post(
  '/forgot-password',
  [emailValidation],
  validateRequest,
  forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    passwordValidation
  ],
  validateRequest,
  resetPassword
);

export default router;