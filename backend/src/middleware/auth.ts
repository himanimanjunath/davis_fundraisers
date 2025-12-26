//protect routes so only logged in users w valid JWT token can access them 
//reads JWT from headers, verifies it, attaches req.userId, blocks unauthorized users

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; //to access variables in .env
dotenv.config(); //load the env vars from .env to make process.env.JWT_SECRET available

//data/shape of JWT we expect
interface JwtPayload {
  id: string; //user ID from db
}

//custom request type that includes authenticated user ID 
export interface AuthRequest extends Request {
  userId?: string; 
}
//so after authentication i can do req.userId

//middleware function called authenticate 
//runs before protected routes
//if auth suceeeds, call next(); else error
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  
  //getting authorization header from incoming request like "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR..."
  const authHeader = req.headers.authorization;
  
  //validate header
  if (!authHeader || !authHeader.startsWith('Bearer')){
    return res.status(401).json({message: 'No token provided'});
  }

  //extract token - splitting the auth header by space and grabbing the actual token part after bearer
  //"Bearer abc123" → token = "abc123"
  //it's an array - bearer is 0 and abc123 is 1
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  //verify the token 

  //check if token is signed using my secret key, decode it / extract data inside it, take user id from token, attach to request object (if verification fails goes to error)
  //now any protected route can do req.userId
  //next() tells express auth succeeded and we can move onto route handlers 
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

};





