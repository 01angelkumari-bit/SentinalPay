import express from 'express';
import { body } from 'express-validator';
import { createTransaction, getTransactions } from '../controllers/transactionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

const transactionValidation = [
  body('recipientEmail').isEmail().withMessage('Valid recipient email is required').normalizeEmail(),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a positive number')
];

router.route('/')
  .post(protect, transactionValidation, validateRequest, createTransaction)
  .get(protect, getTransactions);

export default router;