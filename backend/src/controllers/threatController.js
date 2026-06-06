import ThreatLog from '../models/ThreatLog.js';

export const getThreatLogs = async (req, res, next) => {
  try {
    const logs = await ThreatLog.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};