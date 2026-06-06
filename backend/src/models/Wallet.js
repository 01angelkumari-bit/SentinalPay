import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, required: true, default: 10000.00, min: 0 }, // Starter balance
  currency: { type: String, default: 'USD', uppercase: true },
  isActive: { type: Boolean, default: true },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Wallet', walletSchema);