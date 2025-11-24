import express from 'express';
import { signin, signup, signout, requestPasswordReset, verifyResetCode, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup' , signup);
router.post('/signin' , signin);
router.post('/signout' , signout);
router.post('/request-reset', requestPasswordReset);
router.post('/verify-code', verifyResetCode);
router.post('/reset-password', resetPassword);

export default router;