import Transaction from '../models/Transaction.js';
import FraudDecision from '../models/FraudDecision.js';
import AuditLog from '../models/AuditLog.js';

export const getFlaggedTransactions = async (req, res, next) => {
  try {
    const { decision, minRisk, maxRisk, limit = 100, page = 1 } = req.query;
    const filter = { fraudDecision: { $ne: 'APPROVE' } };

    if (decision) {
      filter.fraudDecision = decision;
    }

    if (minRisk !== undefined || maxRisk !== undefined) {
      filter.riskScore = {};
      if (minRisk !== undefined) filter.riskScore.$gte = Number(minRisk);
      if (maxRisk !== undefined) filter.riskScore.$lte = Number(maxRisk);
    }

    const pageLimit = Math.min(Number(limit) || 100, 200);
    const pageOffset = (Number(page) - 1) * pageLimit;
    const flagged = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(pageOffset)
      .limit(pageLimit);

    res.json(flagged);
  } catch (error) {
    next(error);
  }
};

export const getFraudStats = async (req, res, next) => {
  try {
    const totalEvaluations = await FraudDecision.countDocuments();
    const decisionSummary = await FraudDecision.aggregate([
      {
        $group: {
          _id: '$finalDecision',
          count: { $sum: 1 },
          averageRiskScore: { $avg: '$riskScore' }
        }
      }
    ]);

    const riskDistribution = await FraudDecision.aggregate([
      {
        $bucket: {
          groupBy: '$riskScore',
          boundaries: [0, 25, 50, 75, 101],
          default: 'unknown',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    const recentFraudTrends = await FraudDecision.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            decision: '$finalDecision'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.day': 1 } }
    ]);

    const topTriggeredRules = await FraudDecision.aggregate([
      { $unwind: '$triggeredRules' },
      {
        $group: {
          _id: '$triggeredRules.ruleName',
          count: { $sum: 1 },
          averageWeight: { $avg: '$triggeredRules.weightApplied' }
        }
      },
      { $sort: { count: -1, averageWeight: -1 } },
      { $limit: 20 }
    ]);

    res.json({ totalEvaluations, decisionSummary, riskDistribution, recentFraudTrends, topTriggeredRules });
  } catch (error) {
    next(error);
  }
};

export const getBlockedTransactions = async (req, res, next) => {
  try {
    const { minRisk, maxRisk, limit = 100, page = 1 } = req.query;
    const filter = { fraudDecision: 'BLOCK' };

    if (minRisk !== undefined || maxRisk !== undefined) {
      filter.riskScore = {};
      if (minRisk !== undefined) filter.riskScore.$gte = Number(minRisk);
      if (maxRisk !== undefined) filter.riskScore.$lte = Number(maxRisk);
    }

    const pageLimit = Math.min(Number(limit) || 100, 200);
    const pageOffset = (Number(page) - 1) * pageLimit;
    const blocked = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip(pageOffset)
      .limit(pageLimit);

    res.json(blocked);
  } catch (error) {
    next(error);
  }
};

export const getRecentFraudTrends = async (req, res, next) => {
  try {
    const windowDays = Number(req.query.windowDays) || 30;
    const fromDate = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

    const fraudTrends = await FraudDecision.aggregate([
      { $match: { createdAt: { $gte: fromDate } } },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            decision: '$finalDecision'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.day': 1 } }
    ]);

    res.json({ windowDays, fraudTrends });
  } catch (error) {
    next(error);
  }
};

export const getTopFraudRules = async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.topRulesLimit) || 20, 50);
    const rules = await FraudDecision.aggregate([
      { $unwind: '$triggeredRules' },
      {
        $group: {
          _id: '$triggeredRules.ruleName',
          count: { $sum: 1 },
          averageWeight: { $avg: '$triggeredRules.weightApplied' }
        }
      },
      { $sort: { count: -1, averageWeight: -1 } },
      { $limit: limit }
    ]);

    res.json({ topRules: rules });
  } catch (error) {
    next(error);
  }
};

export const getUserActivitySummary = async (req, res, next) => {
  try {
    const aggregation = await AuditLog.aggregate([
      {
        $group: {
          _id: '$actorId',
          actions: { $push: '$action' },
          recentActivity: { $push: { action: '$action', createdAt: '$createdAt', resourceType: '$resourceType' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);

    res.json({ summary: aggregation });
  } catch (error) {
    next(error);
  }
};
