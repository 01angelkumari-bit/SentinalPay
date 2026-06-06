import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  recipientName: { type: String, required: true },
  amount: { type: Number, required: true, min: 0.01 },
  type: { type: String, enum: ['received', 'sent', 'swap', 'topup'], required: true },
  status: { type: String, enum: ['completed', 'pending', 'failed', 'blocked'], default: 'completed' },
  riskScore: { type: Number, default: 10, min: 0, max: 100 },
  deviceIp: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Transaction', transactionSchema);