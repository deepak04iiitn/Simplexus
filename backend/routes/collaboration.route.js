import express from 'express';
import {
    getCollaborationData,
    getMessages,
    sendMessage,
    getTimeline,
} from '../controllers/collaboration.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/:campaignId', verifyToken, getCollaborationData);
router.get('/:campaignId/messages', verifyToken, getMessages);
router.post('/:campaignId/messages', verifyToken, sendMessage);
router.get('/:campaignId/timeline', verifyToken, getTimeline);

export default router;

