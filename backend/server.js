import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import { connectDB } from './src/config/db.js';
import { errorHandler } from './src/middlewares/errorMiddleware.js';
import { apiLimiter } from './src/middlewares/rateLimiter.js';
import logger from './src/utils/logger.js';

// Route Imports
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import walletRoutes from './src/routes/walletRoutes.js';
import transactionRoutes from './src/routes/transactionRoutes.js';
import threatRoutes from './src/routes/threatRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import healthRoutes from './src/routes/healthRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Global Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use('/api', apiLimiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/threats', threatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/health', healthRoutes);
app.use('/healthz', healthRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: 'SentinalPay API Running' });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info('server.started', { port: PORT, environment: process.env.NODE_ENV || 'development' });
});

process.on('unhandledRejection', (error) => {
  logger.error('unhandled_rejection', { error: error.message });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('uncaught_exception', { error: error.message });
  process.exit(1);
});