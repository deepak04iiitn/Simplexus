import express from 'express';
import {
    createReview,
    getReviews,
    addComment,
    verifyPost,
} from '../controllers/review.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createReview);
router.get('/:deliverableId', verifyToken, getReviews);
router.post('/:id/comment', verifyToken, addComment);
router.post('/verify-post/:deliverableId', verifyToken, verifyPost);

export default router;

