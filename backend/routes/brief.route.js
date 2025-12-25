import express from 'express';
import {
    createBrief,
    getBrief,
    updateBrief,
    deleteBrief,
} from '../controllers/brief.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createBrief);
router.get('/:campaignId', verifyToken, getBrief);
router.put('/:id', verifyToken, updateBrief);
router.delete('/:id', verifyToken, deleteBrief);

export default router;

