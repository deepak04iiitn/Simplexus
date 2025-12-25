import express from 'express';
import {
    createCampaign,
    getCampaigns,
    getCampaign,
    updateCampaign,
    assignCreators,
    acknowledgeBrief,
    acceptInvitation,
    removeCreator,
    addTeamMember,
    deleteCampaign,
    inviteExternalCreator,
    getCampaignByInvitation,
} from '../controllers/campaign.controller.js';
import { verifyToken, verifyTokenOptional } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createCampaign);
router.get('/list', verifyToken, getCampaigns);
router.get('/invite/:token', verifyTokenOptional, getCampaignByInvitation); // Public route, optional auth
router.get('/:id', verifyToken, getCampaign);
router.put('/:id', verifyToken, updateCampaign);
router.post('/:id/assign-creators', verifyToken, assignCreators);
router.post('/:id/invite-external', verifyToken, inviteExternalCreator);
router.post('/invite/:token/accept', verifyToken, acceptInvitation);
router.post('/:id/acknowledge', verifyToken, acknowledgeBrief);
router.post('/:id/remove-creator', verifyToken, removeCreator);
router.post('/:id/team-members', verifyToken, addTeamMember);
router.delete('/:id', verifyToken, deleteCampaign);

export default router;

