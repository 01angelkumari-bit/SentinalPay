import express from 'express';
import { query } from 'express-validator';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import {
  getFlaggedTransactions,
  getFraudStats,
  getBlockedTransactions,
  getRecentFraudTrends,
  getTopFraudRules,
  getUserActivitySummary
} from '../controllers/adminController.js';

const router = express.Router();
router.use(protect, authorize('admin'));

const fraudQueryValidation = [
  query('decision').optional().isIn(['APPROVE', 'REVIEW', 'BLOCK']).withMessage('Decision must be APPROVE, REVIEW, or BLOCK'),
  query('minRisk').optional().isFloat({ min: 0, max: 100 }).withMessage('minRisk must be between 0 and 100').toFloat(),
  query('maxRisk').optional().isFloat({ min: 0, max: 100 }).withMessage('maxRisk must be between 0 and 100').toFloat(),
  query('limit').optional().isInt({ min: 1, max: 200 }).withMessage('limit must be between 1 and 200').toInt(),
  query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer').toInt(),
  query('maxRisk').optional().custom((value, { req }) => {
    if (req.query.minRisk !== undefined && Number(value) < Number(req.query.minRisk)) {
      throw new Error('maxRisk must be greater than or equal to minRisk');
    }
    return true;
  })
];

const trendQueryValidation = [
  query('windowDays').optional().isInt({ min: 1, max: 90 }).withMessage('windowDays must be between 1 and 90').toInt(),
  query('topRulesLimit').optional().isInt({ min: 1, max: 50 }).withMessage('topRulesLimit must be between 1 and 50').toInt()
];

router.get('/transactions/flagged', fraudQueryValidation, validateRequest, getFlaggedTransactions);
router.get('/fraud/stats', validateRequest, getFraudStats);
router.get('/transactions/blocked', fraudQueryValidation, validateRequest, getBlockedTransactions);
router.get('/fraud/trends', trendQueryValidation, validateRequest, getRecentFraudTrends);
router.get('/fraud/rules/top', trendQueryValidation, validateRequest, getTopFraudRules);
router.get('/users/activity', getUserActivitySummary);

export default router;
