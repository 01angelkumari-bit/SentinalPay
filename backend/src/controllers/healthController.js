import mongoose from 'mongoose';

export const healthCheck = async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const healthy = dbState === 1;

  return res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'unavailable',
    uptime: process.uptime(),
    dbState
  });
};
