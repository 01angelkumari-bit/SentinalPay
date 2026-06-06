import express from 'express';
import { getThreatLogs } from '../controllers/threatController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/logs', protect, getThreatLogs);

export default router;