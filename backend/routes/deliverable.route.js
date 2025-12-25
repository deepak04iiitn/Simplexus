import express from 'express';
import {
    createDeliverable,
    getDeliverables,
    getDeliverable,
    submitDraft,
    submitPostProof,
    updatePerformance,
} from '../controllers/deliverable.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createDeliverable);
router.get('/campaign/:campaignId', verifyToken, getDeliverables);
router.get('/:id', verifyToken, getDeliverable);
router.post('/:id/submit-draft', verifyToken, submitDraft);
router.post('/:id/submit-post', verifyToken, submitPostProof);
router.put('/:id/performance', verifyToken, updatePerformance);

export default router;

