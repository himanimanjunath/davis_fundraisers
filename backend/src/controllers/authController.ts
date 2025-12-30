//handling user regisration and login 
//auth: validate input, hash password, save user to MongoDB, issue a JWT
//login: validate input, verify email + password, issue registration JWT

import {Request, Response} from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

//how many rounds of hashing bycrypt should perform 
const SALT_ROUNDS = 10;

// JWT secret key - throw error if not configured
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

//USER REGISTRATION
//async express handler function for user registration
export const register = async (req: Request, res: Response) => {
    const {email, password, name} = req.body;

    if (!email || !password){
        return res.status(400).json({message: 'Email and password required' });
    }

    //check for existing user in mongodb 
    const existing = await User.findOne({email});

    if (existing){
        return res.status(400).json({message: 'Email already registered'});
    }

    //actually hashing the pw using bycrypt 
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    //make new MongoDB doc using mongoose 
    const user = new User({email, password: hashed, name});
    await user.save();

    //generate JWT token for newly registered user
    const token = jwt.sign({ id: String(user._id) }, JWT_SECRET, { expiresIn: '7d' }
    );

    //201 reponse to show success registration with token
    res.status(201).json({
      message: 'Registered',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
}; 

//USER LOGIN
//async express handler function for user login 
export const login = async (req: Request, res: Response) => {
    
    //extract email and pw from request body 
    const {email, password} = req.body;

    //validating both fields are given
    if (!email || !password){
        return res.status(400).json({ message: 'Email and password required'})
    };
    
    //looking for user in db with given email 
    const user = await User.findOne({email});
    
    //if no user exists 
    if (!user){
        return res.status(401).json({message: 'Invalid credentials'})
    };
    

    //use bcrypt to compare raw password provided by user to hashed one in db
    const match = await bcrypt.compare(password, user.password);

    //if passwords don't match, 401 
    if (!match){
        return res.status(401).json({message: 'Invalid credentials'});
    }
    

    //issue jwt same as register
    const token = jwt.sign({ id: String(user._id) }, JWT_SECRET, { expiresIn: '7d' }
    );

    //send reponse w the signed jwt token and basic user info 
    //can use for frontend to store and display to logged in user 
    res.status(200).json({
      message: 'Logged in',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
}