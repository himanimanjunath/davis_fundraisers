//tells express which urls exist for auth and which controller functions should run when those urls are hit

import express from 'express';
import { register, login } from '../controllers/authController.js'; 

//router helps group related routes tgt so here we're grouping all routes related to authentication  
const router = express.Router();

//when request hits this endpoint express calls the register function from authController.ts
//so when user sends a POST request to http://localhost:3000/api/auth/register, the route triggers and runs registraion logic 
router.post('/register', register);

//when someone sends POST req to login the login controller function is called
router.post('/login', login);

export default router;
