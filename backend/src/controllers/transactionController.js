import Transaction from '../models/Transaction.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import ThreatLog from '../models/ThreatLog.js';
import FraudDecision from '../models/FraudDecision.js';
import { evaluateTransactionRisk } from '../services/fraudService.js';
import { recordAudit } from '../services/auditService.js';
import mongoose from 'mongoose';

export const createTransaction = async (req, res, next) => {
  const { recipientEmail, amount } = req.body;
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

    const fraudResult = await evaluateTransactionRisk({
      user: sender,
      senderWallet,
      recipient,
      amount,
      ip: req.ip
    });

    const transactionData = {
      senderId: sender._id,
      recipientId: recipient._id,
      senderName: sender.name,
      recipientName: recipient.name,
      amount,
      type: 'sent',
      fraudDecision: fraudResult.finalDecision,
      fraudReasons: fraudResult.triggeredRules.map((rule) => rule.ruleName),
      fraudExplanation: fraudResult.explanationSummary,
      reviewRequired: fraudResult.finalDecision === 'REVIEW',
      riskScore: fraudResult.riskScore,
      deviceIp: req.ip,
      status: fraudResult.finalDecision === 'BLOCK' ? 'blocked' : fraudResult.finalDecision === 'REVIEW' ? 'pending' : 'completed'
    };

    const [newTx] = await Transaction.create([transactionData], { session });
    await FraudDecision.create([
      {
        userId: sender._id,
        transactionId: newTx._id,
        decision: fraudResult.decision,
        finalDecision: fraudResult.finalDecision,
        riskScore: fraudResult.riskScore,
        triggeredRules: fraudResult.triggeredRules,
        explanationSummary: fraudResult.explanationSummary,
        explanation: fraudResult.explanation,
        context: fraudResult.context
      }
    ], { session });

    if (fraudResult.finalDecision === 'BLOCK') {
      await ThreatLog.create([{
        userId: sender._id,
        transactionId: newTx._id,
        type: 'Blocked',
        severity: 'high',
        message: `Blocked transaction of $${amount} to ${recipient.name} due to fraud risk score ${fraudResult.riskScore}.`,
        time: 'Just now'
      }], { session });

      await session.commitTransaction();
      session.endSession();

      await recordAudit({
        actorId: sender._id,
        action: 'TRANSACTION_BLOCKED',
        resourceType: 'Transaction',
        resourceId: newTx._id,
        details: { amount, recipientEmail, decision: fraudResult.finalDecision, riskScore: fraudResult.riskScore },
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(403).json({ message: 'Transaction blocked by fraud engine risk validation.', riskScore: fraudResult.riskScore });
    }

    if (fraudResult.finalDecision === 'REVIEW') {
      await ThreatLog.create([{
        userId: sender._id,
        transactionId: newTx._id,
        type: 'Warning',
        severity: 'medium',
        message: `Transaction of $${amount} to ${recipient.name} flagged for review due to risk score ${fraudResult.riskScore}.`,
        time: 'Just now'
      }], { session });

      await session.commitTransaction();
      session.endSession();

      await recordAudit({
        actorId: sender._id,
        action: 'TRANSACTION_REVIEW_REQUIRED',
        resourceType: 'Transaction',
        resourceId: newTx._id,
        details: { amount, recipientEmail, decision: fraudResult.finalDecision, riskScore: fraudResult.riskScore },
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(202).json({ message: 'Transaction requires review before completion.', riskScore: fraudResult.riskScore });
    }

    senderWallet.balance -= Number(amount);
    recipientWallet.balance += Number(amount);

    await senderWallet.save({ session });
    await recipientWallet.save({ session });

    await session.commitTransaction();
    session.endSession();

    await recordAudit({
      actorId: sender._id,
      action: 'TRANSACTION_APPROVED',
      resourceType: 'Transaction',
      resourceId: newTx._id,
      details: { amount, recipientEmail, riskScore: fraudResult.riskScore },
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    res.status(201).json(newTx);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    next(err);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const txs = await Transaction.find({
      $or: [{ senderId: req.user.id }, { recipientId: req.user.id }]
    }).sort({ createdAt: -1 });

    const relativeTxs = txs.map((tx) => {
      const type = tx.senderId.toString() === req.user.id ? 'sent' : 'received';
      const name = type === 'sent' ? tx.recipientName : tx.senderName;

      return {
        id: tx._id,
        type,
        name,
        amount: type === 'sent' ? -tx.amount : tx.amount,
        time: tx.createdAt,
        status: tx.status,
        fraudDecision: tx.fraudDecision,
        fraudReasons: tx.fraudReasons
      };
    });

    res.json(relativeTxs);
  } catch (err) {
    next(err);
  }
};
