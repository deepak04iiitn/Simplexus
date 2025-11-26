import express from 'express';
import { updateUser, deleteUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Update profile
router.put('/:id', verifyToken, updateUser);

// Delete account
router.delete('/:id', verifyToken, deleteUser);

export default router;


