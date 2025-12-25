import express from 'express';
import {
    createPayment,
    getPayments,
    triggerPayment,
    updatePayment,
} from '../controllers/payment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createPayment);
router.get('/campaign/:campaignId', verifyToken, getPayments);
router.post('/trigger/:deliverableId', verifyToken, triggerPayment);
router.put('/:id', verifyToken, updatePayment);

export default router;

