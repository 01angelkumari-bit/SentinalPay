import Wallet from '../models/Wallet.js';
import { recordAudit } from '../services/auditService.js';

export const getWalletBalance = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (wallet) {
      await recordAudit({
        actorId: req.user.id,
        action: 'WALLET_BALANCE_VIEW',
        resourceType: 'Wallet',
        resourceId: wallet._id,
        details: { balance: wallet.balance, currency: wallet.currency },
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      res.json({
        balance: wallet.balance,
        currency: wallet.currency,
        isActive: wallet.isActive
      });
    } else {
      res.status(404).json({ message: 'Wallet not found' });
    }
  } catch (err) {
    next(err);
  }
};
