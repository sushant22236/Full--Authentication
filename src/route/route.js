import express from 'express';

import {loginUser, logoutuser, registerUser} from '../Controller/auth.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutuser);


export default router;
