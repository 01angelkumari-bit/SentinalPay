import mongoose from 'mongoose';

const fraudDecisionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  decision: { type: String, enum: ['APPROVE', 'REVIEW', 'BLOCK'], required: true },
  finalDecision: { type: String, enum: ['APPROVE', 'REVIEW', 'BLOCK'], required: true },
  riskScore: { type: Number, min: 0, max: 100, required: true },
  triggeredRules: [
    {
      ruleName: { type: String, required: true },
      weightApplied: { type: Number, required: true },
      evidence: { type: String }
    }
  ],
  explanationSummary: { type: String },
  explanation: { type: String },
  context: {
    ip: { type: String },
    recipientEmail: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('FraudDecision', fraudDecisionSchema);
