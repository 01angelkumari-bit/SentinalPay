import User from '../models/User.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        deviceTrustScore: user.deviceTrustScore,
        twoFactorEnabled: user.twoFactorEnabled
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    next(err);
  }
};