//making sure database is online / connecting app to database 

//mongoose lib for MongoDB interaction 
import mongoose from 'mongoose'; 

//asynchronous function that will try to connect to MongoDB database using the connection string passed in (mongoUri)
const connectDB = async (mongoUri: string) => {
    try{

        //telling mongoose to connect to db
        await mongoose.connect(mongoUri);

        //if it works 
        console.log('MongoDB connected');

    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);

    }
};

 
export default connectDB;



