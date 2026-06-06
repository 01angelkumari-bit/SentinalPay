import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const generateRandomToken = () => crypto.randomBytes(32).toString('hex');

export const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

export const createRefreshTokenJwt = (userId) => {
  const jti = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
  return jwt.sign(
    { sub: userId.toString(), type: 'refresh', jti },
    process.env.JWT_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '30d' }
  );
};

export const verifyRefreshTokenJwt = (token) => jwt.verify(token, process.env.JWT_SECRET);
