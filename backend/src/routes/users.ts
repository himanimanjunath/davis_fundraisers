//connects routes to user controller functions

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getCurrentUser } from '../controllers/userController.js';
import { getMyFundraisers } from '../controllers/fundraiserController.js';

const router = express.Router();

//GET endpoint at /me to return logged in user
//when request hits /api/users/me, auth middleware runs first to validate JWT and populate req.userId
//then getCurrentUser controller function is called w/ authenticated user ID
router.get('/me', authenticate, getCurrentUser);

//GET endpoint at /me/fundraisers to return user's fundraisers
//protected by authenticate middleware to ensure valid JWT token
router.get('/me/fundraisers', authenticate, getMyFundraisers);

export default router;

