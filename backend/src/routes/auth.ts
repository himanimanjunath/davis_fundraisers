//tells express which urls exist for auth and which controller functions should run when those urls are hit

import express from 'express';
import { register, login } from '../controllers/authController.js'; 

//new router object from Express
//router helps group related routes tgt so here we're grouping all routes related to authentication  
//mini express app handling only auth routes
const router = express.Router();

//new route for http post requests to /register 
//when request hits this endpoint express calls the register function 
//so when user sends a POST request to http://localhost:3000/api/auth/register, the route trigers and runs registraion logic from earlier 
router.post('/register', register);

//same thing as register but for logging in 
//when someone sends POST req to login the login controller function is called
//checks credentials/compares passwords/issues JWT token 
router.post('/login', login);

//export router to use in main app 
export default router;
