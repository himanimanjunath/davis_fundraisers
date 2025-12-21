//defines all HTTP routes for user-related operations
//connects routes to their corresponding controller functions

import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { getCurrentUser } from '../controllers/userController.js';
import { getMyFundraisers } from '../controllers/fundraiserController.js';

//new express router instance for user-related endpoints
const router = express.Router();

//GET endpoint at /me to return current authenticated user
//protected by authenticate middleware to ensure valid JWT token
//when request hits /api/users/me, authenticate middleware runs first to validate JWT and populate req.userId
//then getCurrentUser controller function is called with the authenticated user ID
router.get('/me', authenticate, getCurrentUser);

//GET endpoint at /me/fundraisers to return current authenticated user's fundraisers
//protected by authenticate middleware to ensure valid JWT token
//returns all fundraisers created by the authenticated user, sorted by createdAt descending
router.get('/me/fundraisers', authenticate, getMyFundraisers);

//export router to use in main app
export default router;

