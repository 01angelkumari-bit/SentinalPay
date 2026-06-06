import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import ThreatLog from '../models/ThreatLog.js';
import mongoose from 'mongoose';

export const createTransaction = async (req, res, next) => {
  const { recipientEmail, amount, type } = req.body;
  const session = await mongoose.startSession();
  
  try {
    session.startTransaction();

    const sender = await User.findById(req.user.id).session(session);
    const senderWallet = await Wallet.findOne({ userId: req.user.id }).session(session);

    if (!senderWallet || senderWallet.balance < amount) {
      throw new Error('Insufficient wallet funds');
    }

    const recipient = await User.findOne({ email: recipientEmail }).session(session);
    if (!recipient) {
      throw new Error('Recipient user email not found in SentinalPay system');
    }

    const recipientWallet = await Wallet.findOne({ userId: recipient._id }).session(session);
    if (!recipientWallet) {
      throw new Error('Recipient wallet not found');
    }

    // Dynamic Risk Simulation
    let riskScore = 10;
    let isBlocked = false;
    
    if (amount > 10000) {
      riskScore = 85; // High transaction pattern threshold
    } else if (amount > 5000) {
      riskScore = 45; // Medium
    }

    // High risk trigger blocking transaction and logging a threat
    if (riskScore >= 80) {
      isBlocked = true;
      await ThreatLog.create([{
        userId: sender._id,
        type: 'Blocked',
        severity: 'high',
        message: `High risk transaction of $${amount} to ${recipient.name} blocked due to anomalous amount size.`,
        time: 'Just now'
      }], { session });

      await Transaction.create([{
        senderId: sender._id,
        recipientId: recipient._id,
        senderName: sender.name,
        recipientName: recipient.name,
        amount,
        type: 'sent',
        status: 'blocked',
        riskScore,
        deviceIp: req.ip
      }], { session });

      await session.commitTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Transaction blocked by fraud engine risk validation.', riskScore });
    }

    // Perform atomic transaction updates
    senderWallet.balance -= Number(amount);
    recipientWallet.balance += Number(amount);
    
    await senderWallet.save({ session });
    await recipientWallet.save({ session });

    const newTx = await Transaction.create([{
      senderId: sender._id,
      recipientId: recipient._id,
      senderName: sender.name,
      recipientName: recipient.name,
      amount,
      type: 'sent',
      status: 'completed',
      riskScore,
      deviceIp: req.ip
    }], { session });

    // Also Log warning threat if transaction was moderately risky
    if (riskScore >= 40) {
      await ThreatLog.create([{
        userId: sender._id,
        type: 'Warning',
        severity: 'medium',
        message: `Unusual transaction size of $${amount} triggered warning rules logic.`,
        time: 'Just now'
      }], { session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(newTx[0]);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const txs = await Transaction.find({
      $or: [{ senderId: req.user.id }, { recipientId: req.user.id }]
    }).sort({ createdAt: -1 });

    // Map transaction type indicator relative to who is asking
    const relativeTxs = txs.map(tx => {
      const type = tx.senderId.toString() === req.user.id ? 'sent' : 'received';
      const name = type === 'sent' ? tx.recipientName : tx.senderName;
      
      return {
        id: tx._id,
        type,
        name,
        amount: type === 'sent' ? -tx.amount : tx.amount,
        time: tx.createdAt,
        status: tx.status
      };
    });

    res.json(relativeTxs);
  } catch (err) {
    next(err);
  }
};