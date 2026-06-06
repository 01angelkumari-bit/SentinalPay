import AuditLog from '../models/AuditLog.js';
import logger from '../utils/logger.js';

export const recordAudit = async ({ actorId, action, resourceType, resourceId, details, ip, userAgent }) => {
  try {
    await AuditLog.create({
      actorId,
      action,
      resourceType,
      resourceId,
      details,
      ip,
      userAgent
    });
  } catch (error) {
    logger.error('audit.record.failed', { error: error.message, action, actorId });
  }
};
