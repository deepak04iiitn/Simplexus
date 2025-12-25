import express from 'express';
import {
    generateReport,
    getReport,
    getReportByLink,
    shareReport,
    getReportsByCampaign,
} from '../controllers/report.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/generate', verifyToken, generateReport);
router.get('/campaign/:campaignId', verifyToken, getReportsByCampaign);
router.get('/:id', verifyToken, getReport);
router.get('/share/:link', getReportByLink); // Public route for shareable links
router.post('/:id/share', verifyToken, shareReport);

export default router;

