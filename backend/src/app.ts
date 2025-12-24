//defines my express app - wires the middleware, routes, and basic app config together but doesn't start the server yet
//creates + configures express app, sets up middleware, mounts routes, and exports app for server to run 
//this separates app config (middleware + routes) while server startup is for listen and db connection 

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import fundraiserRoutes from './routes/fundraisers.js';
import usersRoutes from './routes/users.js';

dotenv.config();

//express app instance
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

console.log("JWT_SECRET:", process.env.JWT_SECRET)


//use CORS middleware globally to all routes 
app.use(cors());

//use middleware to parse the json bodies for request
//without it the req.body would be undefined for POST req with JSON 
app.use(express.json());

//mount authentication routes at /api/auth so /api/auth/register and /api/auth/login are handled by authRoutes
app.use('/api/auth', authRoutes);

//same but for fundraisers, so the get post and get delete are handled by fundraiserRoutes 
app.use('/api/fundraisers', fundraiserRoutes);

//mount user routes at /api/users so GET /api/users/me returns current authenticated user
app.use('/api/users', usersRoutes);

//define root route like GET/ for testing and returns simple json response w msg and status
//good for testing 
app.get('/', (req, res) => {
  res.send({ message: 'UC Davis Fundraisers API', status: 'ok' });
});

//so we can import into server 
export default app;
