import express from 'express';

import {loginUser, logoutuser, registerUser} from '../Controller/auth.controller.js';
import {sendOtpVerifyEmail, verifyEmail, isAuthenticated} from '../Controller/emaiVerification.controller.js';
import { userAuth } from '../middleware/userauth.js';
import { getUserDetails } from '../Controller/user.controller.js';

import { sendPasswordResetOtp, resetPassword } from '../Controller/passwordReset.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutuser);
router.post('/send-otp', userAuth, sendOtpVerifyEmail);
router.post('/verify-email', userAuth, verifyEmail);
router.post('/is-authenticated', userAuth, isAuthenticated);
router.post('/send-reset-otp', sendPasswordResetOtp);
router.post('/reset-password', resetPassword);
router.get('/user-details', userAuth, getUserDetails);


export default router;
