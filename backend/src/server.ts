import app from './app.js'; 

//async function connecting Node.js backend to MongoDB database
import connectDB from './config/db.js'; 

//import and calling config to load env vars from .env to process.env
import dotenv from 'dotenv';
dotenv.config();

//reads port variable from .env or default assigns 4000
const PORT = process.env.PORT || 4000;

//reads MongoDB connection URI from .env
//tells mongoose which mongodb cluster to connect to 
const MONGO_URI = process.env.MONGO_URI || '';

console.log("Hello");
console.log(MONGO_URI);

//calling connectDB to connect to mongodb using URI and it returns a promise and we use then to wait till connection is successful before starting server 
connectDB(MONGO_URI).then(() => {

  //start express server on port from earlier (4000)
  //app.lsiten is what makes backend start listening to HTTP requests
  app.listen(PORT, () => {
    //so we know it's running on our end!
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
