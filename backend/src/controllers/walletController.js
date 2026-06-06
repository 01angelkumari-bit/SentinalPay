import Wallet from '../models/Wallet.js';

export const getWalletBalance = async (req, res, next) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (wallet) {
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