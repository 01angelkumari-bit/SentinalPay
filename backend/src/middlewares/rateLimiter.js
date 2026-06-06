import rateLimit from 'express-rate-limit';

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // max 100 registration or login requests per window
  message: { message: 'Too many authentication attempts, try again in 15 minutes.' }
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // 500 general API requests
  message: { message: 'Api call limit reached.' }
});