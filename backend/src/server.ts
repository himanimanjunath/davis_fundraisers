//entry point of backend - file that connects to database and turns server on 
//file boots the app, loads environment var, connects to mongodb, starts express server

import app from './app.js'; 
import connectDB from './config/db.js'; 

//import and calling config to load env vars from .env to process.env
import dotenv from 'dotenv';
dotenv.config();

//read port variable from .env or default assign 4000
const PORT = process.env.PORT || 4000;

//read mongodb connection URI from .env
const MONGO_URI = process.env.MONGO_URI || '';

//calling connectDB to connect to mongodb using URI and it returns a promise and we use then to wait till connection is successful before starting server 
connectDB(MONGO_URI).then(() => {

  //start express server on port from earlier (4000)
  //app.lsiten is what makes backend start listening to HTTP requests
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
