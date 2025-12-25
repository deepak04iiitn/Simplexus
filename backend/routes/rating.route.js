import express from 'express';
import {
    createRating,
    getRatings,
} from '../controllers/rating.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createRating);
router.get('/:userId', verifyToken, getRatings);

export default router;

