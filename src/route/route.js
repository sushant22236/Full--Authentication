import express from 'express';

import {loginUser, logoutuser, registerUser} from '../Controller/auth.controller.js';
import {sendOtpVerifyEmail, verifyEmail} from '../Controller/emaiVerification.controller.js';
import { userAuth } from '../middleware/userauth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutuser);
router.post('/send-otp', userAuth, sendOtpVerifyEmail);
router.post('/verify-email', userAuth, verifyEmail);


export default router;
