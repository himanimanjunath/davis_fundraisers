//blueprint for the user info  
//user schema and model tells MongoDB and TypeScript what user looks like and lets backend create, read, and authenticate users

import {Schema, model, Document} from 'mongoose';
//model - usable model from schema so we can CRUD with MongoDB

export interface IUser{
    email: string;
    password: string;
    name?: string;
}

//new schema for users 
const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: String
}, { timestamps: true }); //automatically adds two fields - createdAt for when user was created and updatedAt for when the user was last modified

export default model<IUser>('User', userSchema);
//'User' is name of collection and Mongo saves it as 'users' automatically
//userSchema is the schema 


