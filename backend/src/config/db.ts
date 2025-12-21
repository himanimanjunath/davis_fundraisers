//connecting app to database (mongodb using mongoose)
//keeps database logic separate from server logic 
//prevents server from running without DB
//basically makes sure the database is online before app does anything else - how does this app connect to its database?

import mongoose from 'mongoose'; //mongoose lib for MongoDB interaction 

//asynchronous function that will try to connect to your MongoDB database using the connection string you pass in
//mongoUri is connection string 
// function is async because connecting to db takes time and we want to use await
const connectDB = async (mongoUri: string) => {
    try{
        //telling mongoose to connect to db
        await mongoose.connect(mongoUri);

        //print if success
        console.log('MongoDB connected');

    } catch (err) {
        //if we have a problem!
        console.error('MongoDB connection error:', err);
        process.exit(1);

    }
};

//i can import this function to a diff file like server.ts
//use it to start db connection before running server 
export default connectDB;



