//for user authentication and account management
//manage how users create accounts, log in, and receive JWT tokens

import {Request, Response} from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


//how many rounds of hashing that bycrypt should perform 
//10 is dfault for security and speed 
const SALT_ROUNDS = 10;

//async express handler function for user registeration
// req - incomin data like email pw and name
//res - to send reponses to the client 
export const register = async (req: Request, res: Response) => {
    const {email, password, name} = req.body;

    //if either missing then 400 bad request and stops function 
    if (!email || !password){
        return res.status(400).json({message: 'Email and password required' });
    }

    //searching mongodb user collection and seeing if user already exists w that email 
    const existing = await User.findOne({email});

    //400 message for already existing email in db
    if (existing){
        return res.status(400).json({message: 'Email already registered'});
    }

    //we're hashing the pw using bycrypt 
    //adding salt (randomness) and doing 10 rounds of encryption 
    //result is stored as hashed in the database (not the plain passowrd) 
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    //makes new user document using mongoose 
    //storing hashed pass instead of raw 
    const user = new User({email, password: hashed, name});

    //saving the doc into mongodb
    await user.save();

    //201 reponse to show success registration 
    res.status(201).json({message: 'Registered'});
}; 

//login function 

//exporting async express handler function for user login 
export const login = async (req: Request, res: Response) => {
    
    //extracting email and pw from request body 
    const {email, password} = req.body;
    //console.log("one");

    //validating both fields are given 
    if (!email || !password){
        return res.status(400).json({ message: 'Email and password required'})
    };
    
    //console.log("two");

    //looking for user in database with given email 
    const user = await User.findOne({email});
    
    //console.log("three");

    //if no user exists w the email return 401 
    if (!user){
        return res.status(401).json({message: 'Invalid credentials'})
    };
    
    //console.log("four");

    //using bcrypt to compare raw password provided by user to the hashed one in the database
    const match = await bcrypt.compare(password, user.password);

    //if passwords don't match, 401 
    if (!match){
        return res.status(401).json({message: 'Invalid credentials'});
    }
    
    //console.log("five");

    //load secret key used to sign JWT from env
    const secret = process.env.JWT_SECRET!;
    
    //console.log("six");

    res.status(200).json({message: 'Logged in'});

    //make jwt token that encodes user's mongodb id 
    //jwt sign arguments
    //payload - data you're encoding 
    //secret key - from env 
    // token expires in 7 days by default 

    //FIGURE THIS OUT
    //const token = jwt.sign({ id: user._id }, secret, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });


    //send json reponse w the signed jwt token and basic user info 
    //useful for frontend to store and display to logged in user 
}