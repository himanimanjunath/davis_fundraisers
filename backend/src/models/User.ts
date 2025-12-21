/*
models folder to define data model/schema for how user info is stored in the MongoDB database using Mongoose
how user accounts and stored and handled in database
user schema and model tells MongoDB and TypeScript what a user looks like and lets the backend create, read, and authenticate users
*/

import {Schema, model, Document} from 'mongoose';
//Schema - structure of MongoDB documents
//model - creates usable model from schema so we can CRUD with MongoDB
//Document - represents MongoDB document

// reusable typescript type 
export interface IUser extends Document {
    //email -> every user must have string email type
    email: string;

    //password -> every user must have password 
    password: string;

    //name -> ? means optional field (for name)
    name?: string;
}

//makes new schema for users 
//
const userSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    name: String
}, { timestamps: true }); // this automatically adds two fields - createdAt for when user was created and updatedAt for when the user was last modified

export default model<IUser>('User', userSchema);
//mongoose model function will create and export User model from schema 
//'User' is name of collection and Mongo saves it as 'users' automatically
//userSchema is the schema 


