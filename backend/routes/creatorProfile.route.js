import express from 'express';
import {
    createOrUpdateProfile,
    getProfile,
    getProfileBySlug,
    addPortfolioItem,
    generateResume,
    searchCreators,
} from '../controllers/creatorProfile.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createOrUpdateProfile);
router.put('/update', verifyToken, createOrUpdateProfile);
router.get('/user/:userId', verifyToken, getProfile);
router.get('/slug/:slug', getProfileBySlug); // Public route
router.post('/portfolio', verifyToken, addPortfolioItem);
router.get('/:userId/resume', verifyToken, generateResume);
router.get('/search/creators', verifyToken, searchCreators);

export default router;

