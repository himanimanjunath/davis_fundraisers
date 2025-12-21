//checks if requests have valid JWT and extract user ID from that JWT
//attach user ID to request
//block request if token is missing or invalid
//protecting routes so only logged in users can 

//protect routes so only logged in users w valid JWT token can access them 

import { Request, Response, NextFunction } from 'express';
//request - for HTTP request obj 
//response - type for HTTP response obj 
//next function - for next function in miiddleware to pass control to next function 

import jwt from 'jsonwebtoken';
//imports jsonwebtoken library - to sign and verify JWTs (JSON Web Tokens)

import dotenv from 'dotenv';
dotenv.config();
//importing dotenv so we can access vars in .env
//dotenv.config loads the vars into process.env so now process.env.JWT_SECRET will have the JWT key 

interface JwtPayload {
  id: string; //usually user ID from database
}

//custom request type that extends express's request 
export interface AuthRequest extends Request {
  userId?: string;
  //to store authenticated user id
}

//making middleware function called authenticate and it takes in 
//req - http request 
//res - http response
//next - passing control to next middleware/route handler
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  //getting authorization header from incoming request 
  const authHeader = req.headers.authorization;
  
  //checking if authorization header exists and starts w bearer
  //bc JWTs are usually sent like: Authorization: Bearer <token>
  //sends 401 if not 
  //basically preventing 
  if (!authHeader || !authHeader.startsWith('Bearer')){
    return res.status(401).json({message: 'No token provided'});
  }

  //splitting the auth header by space and grabbing the actual token part after bearer
  //"Bearer abc123" → token = "abc123"
  //it's an array - bearer is 0 and abc123 is 1
  const token = authHeader.split(' ')[1];

  /*

  try{
    const secret = process.env.JWT_SECRET!;//gets the secret key from env

    //verifies token using secret 
    //jwt.verify returns decoded payload if valid
    const payload = jwt.verify(token, secret) as JwtPayload;

    //stores user ID from token on request object so downstream routes know which user is authenticated
    req.userId = payload.id; 
    
    //next middleware/route handler
    next();
  } catch (err){
    return res.status(401).json({message: 'invalid token'});
  }
    */

   if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'object' && decoded && 'id' in decoded) {
      req.userId = (decoded as JwtPayload).id;
      next();
    } else {
      return res.status(401).json({ message: 'Invalid token payload' });
    }
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }

};





