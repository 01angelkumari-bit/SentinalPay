import Transaction from '../models/Transaction.js';

const clampScore = (score) => Math.max(0, Math.min(100, score));

const buildExplanationSummary = (decision, triggeredRules) => {
  if (!triggeredRules.length) {
    return 'Approved because no high-risk fraud indicators were detected.';
  }

  const reasons = triggeredRules.map((rule) => {
    const phrase = rule.ruleName.replace(/_/g, ' ');
    return `${phrase} (${rule.evidence})`;
  });

  if (decision === 'BLOCK') {
    return `Blocked because ${reasons.join(' and ')}.`;
  }
  if (decision === 'REVIEW') {
    return `Flagged for review because ${reasons.join(' and ')}.`;
  }
  return `Approved with risk score ${clampScore(triggeredRules.reduce((sum, rule) => sum + rule.weightApplied, 0))} because ${reasons.join(' and ')}.`;
};

export const evaluateTransactionRisk = async ({ user, senderWallet, recipient, amount, ip }) => {
  const triggeredRules = [];
  const normalizedAmount = Number(amount);
  const balanceRatio = senderWallet.balance ? normalizedAmount / senderWallet.balance : 1;

  const addRule = (ruleName, weightApplied, evidence) => {
    triggeredRules.push({ ruleName, weightApplied, evidence });
  };

  if (normalizedAmount <= 0) {
    addRule('invalid_amount', 50, `amount=${normalizedAmount}`);
  }

  if (normalizedAmount > 10000) {
    addRule('high_transaction_amount', 40, `amount=$${normalizedAmount}`);
  } else if (normalizedAmount > 5000) {
    addRule('large_transaction_amount', 20, `amount=$${normalizedAmount}`);
  }

  if (balanceRatio > 0.75) {
    addRule('wallet_balance_spike', 30, `usage=${Math.round(balanceRatio * 100)}% of balance`);
  } else if (balanceRatio > 0.5) {
    addRule('high_balance_usage', 15, `usage=${Math.round(balanceRatio * 100)}% of balance`);
  }

  const velocityWindow = new Date(Date.now() - 15 * 60 * 1000);
  const recentTransactionCount = await Transaction.countDocuments({
    senderId: user._id,
    createdAt: { $gt: velocityWindow }
  });

  if (recentTransactionCount >= 5) {
    addRule('high_transaction_velocity', 30, `${recentTransactionCount} transfers in the last 15 minutes`);
  } else if (recentTransactionCount >= 3) {
    addRule('moderate_transaction_velocity', 15, `${recentTransactionCount} transfers in the last 15 minutes`);
  }

  if (user.failedLoginAttempts > 2) {
    addRule('repeated_failed_attempts', 15, `failedLoginAttempts=${user.failedLoginAttempts}`);
  }

  if (user.lastLoginIp && user.lastLoginIp !== ip) {
    addRule('suspicious_location_change', 15, `lastLoginIp=${user.lastLoginIp} currentIp=${ip}`);
  }

  if (user.deviceTrustScore != null && user.deviceTrustScore < 70) {
    addRule('low_device_trust', 15, `deviceTrustScore=${user.deviceTrustScore}`);
  }

  const priorRecipientCount = await Transaction.countDocuments({
    senderId: user._id,
    recipientId: recipient._id
  });

  if (priorRecipientCount === 0) {
    addRule('new_recipient', 10, 'first transfer to this recipient');
  }

  const rawRiskScore = triggeredRules.reduce((total, rule) => total + rule.weightApplied, 0);
  const riskScore = clampScore(rawRiskScore);
  const finalDecision = riskScore >= 85 ? 'BLOCK' : riskScore >= 50 ? 'REVIEW' : 'APPROVE';
  const explanationSummary = buildExplanationSummary(finalDecision, triggeredRules);

  return {
    riskScore,
    decision: finalDecision,
    finalDecision,
    triggeredRules,
    explanationSummary,
    explanation: explanationSummary,
    context: {
      ip,
      recipientEmail: recipient.email
    }
  };
};
