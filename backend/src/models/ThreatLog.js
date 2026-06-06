import mongoose from 'mongoose';

const threatLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  type: { type: String, enum: ['Blocked', 'Warning', 'Resolved'], required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['low', 'medium', 'high'], required: true },
  time: { type: String, required: true }, // formatted for instant UI display
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('ThreatLog', threatLogSchema);