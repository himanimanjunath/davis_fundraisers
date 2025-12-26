//defines express app - wires the middleware, routes, and basic app config together but doesn't start the server yet
//separates app config (middleware + routes) while server startup is for listen and db connection 

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

//CORS middleware globally to all routes 
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//middleware to parse the json bodies for request
//without it the req.body would be undefined for POST req with JSON 
app.use(express.json());

//mount auth routes at /api/auth so /api/auth/register and /api/auth/login are handled by authRoutes
app.use('/api/auth', authRoutes);

//get post and delete are handled by fundraiserRoutes 
app.use('/api/fundraisers', fundraiserRoutes);

//mount user routes at /api/users so GET /api/users/me returns current logged in user
app.use('/api/users', usersRoutes);

//for testing 
app.get('/', (req, res) => {
  res.send({ message: 'UC Davis Fundraisers API', status: 'ok' });
});

export default app;
