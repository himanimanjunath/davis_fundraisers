//defines backend logic for handling fundraiser related HTTP requests
//when frontend makes a request about fundraisers, what should the server do?
// creates, lists, deletes, gets one fundraiser
//talks to db using fundraiser model 
//frontend → route → controller → mongodb → reponse


//request = incoming http request and response = outgoing http response
import { Request, Response } from 'express';

//to edit documents in fundraiser collection in mongodb
import Fundraiser from '../models/Fundraiser.js';

//so backend knows which user is deleting / creating fundraisers 
import { AuthRequest } from '../middleware/auth.js';

//for ObjectId validation
import mongoose from 'mongoose'; 

//function handling POST requests to make new fundraisers
//using authrequest because the route needs authentication (we know who's creating the fundraiser)
export const createFundraiser = async (req:AuthRequest, res: Response) => {
  
  //pulling out form data from request body 
  //frontend sends a JSON like: 
  /*
  {
  "clubName": "Robotics Club",
  "fundraiserName": "Bake Sale",
  "location": "Student Center",
  "dateTime": "2025-11-15T10:00:00",
  "proceedsInfo": "Proceeds go to STEM programs",
  "instagramLink": "https://instagram.com/xxxxxx"
  }
  */
  const { clubName, fundraiserName, location, dateTime, proceedsInfo, instagramLink, flyerImage } = req.body;

  if (!clubName || !fundraiserName || !location || !dateTime){
    return res.status(400).json({ message: 'clubName, fundraiserName, location and dateTime are required' })
  }

  //making new fundraiser document using the model 
  //coverting dateTime into a real js date obj
  //req.userId to record which logged in user made it 
  try {
  const fund = new Fundraiser({
    clubName,
    fundraiserName,
    location,
    dateTime: new Date(dateTime),
    proceedsInfo,
    instagramLink,
    flyerImage,
    createdBy: req.userId
  });

  //save fundraiser doc to mongodb
  await fund.save();

  //return http 201 created and send back saved fundraiser as JSON 
  res.status(201).json(fund);

//500 internal server error if smthn goes wrong like mongodb failing 
  }catch (err){
  res.status(500).json({message: 'Error creating fundraiser', error: err});
  }
};


//listing fundraisers func 

//handling get request to list the fundraisers 
//this is a public route so no auth needed 
export const listFundraisers = async (req: Request, res: Response) => {
  
  //reading optional query params from the URL 
  const {club, upcoming} = req.query;

  //start with empty filter obj to build our MongoDB query conditions 
  const filter: any = {};

  //for funsies - filtering option so if we provide specific club it filters only that club's fundraisers
  if (club) filter.clubName = club;
  //for fundraisers happening in the future (greater than or equal to now)
  if (upcoming === 'true') filter.DateTime = {$gte: new Date()};

  //query database for matching fundraisers 
  //sort by date/time ascending (1 is oldest first)
  //limit to 200 results to prevent overloading response
  //sending list back JSON 
  const funds = await Fundraiser.find(filter).sort({dateTime: 1}).limit(200).exec();
  res.json(funds);
}

export const getFundraiser = async (req: Request, res: Response) => {
  //gettung fundraiser ID from URL
  const id = req.params.id;
  
  //look up fundraiser by id in mongodb and if not found return error and if found send fundraiser as json 
  const fund = await Fundraiser.findById(id);
  if (!fund) return res.status(404).json({message: 'Not found'});
  res.json(fund);

}

export const deleteFundraiser = async (req: AuthRequest, res: Response)=>{
  try {
    const id = req.params.id;
    
    // Log request details for debugging
    console.log('Backend Controller - DELETE Request:', {
      fundraiserId: id,
      userId: req.userId,
      authorizationHeader: req.headers.authorization ? `${req.headers.authorization.substring(0, 20)}...` : 'missing'
    });
    
    // Check if userId is available from authentication
    if (!req.userId) {
      console.log('Backend Controller - Missing userId, returning 401');
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate that id exists and is a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.log('Backend Controller - Invalid ObjectId format, returning 404');
      return res.status(404).json({ message: 'Not found' });
    }

    // Find fundraiser by ID
    const fund = await Fundraiser.findById(id);
    if (!fund) {
      console.log('Backend Controller - Fundraiser not found, returning 404');
      return res.status(404).json({ message: 'Not found' });
    }

    // Log fundraiser ownership details for debugging
    console.log('Backend Controller - Ownership check:', {
      fundraiserCreatedBy: fund.createdBy?.toString(),
      requestUserId: req.userId,
      match: fund.createdBy?.toString() === req.userId
    });

    //only person/acc who created the fundraiser can delete it
    //i wanna change this so it atuomatically deletes after the date for fundraiser has passed 
    if (fund.createdBy?.toString() !== req.userId) {
      console.log('Backend Controller - User does not own fundraiser, returning 403');
      return res.status(403).json({ message: 'Not authorized' });
    }

    //delete fundraiser from database using deleteOne() method
    await fund.deleteOne();
    console.log('Backend Controller - Fundraiser deleted successfully, returning 200');
    res.status(200).json({ message: 'Deleted' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error('Backend Controller - Error deleting fundraiser:', {
      error: errorMessage,
      stack: errorStack,
      fundraiserId: req.params.id,
      userId: req.userId
    });
    res.status(500).json({ 
      message: 'Error deleting fundraiser', 
      error: errorMessage 
    });
  }
}

//returns all fundraisers created by the authenticated user
//uses req.userId from AuthRequest to filter fundraisers
//sorts by createdAt descending (newest first)
export const getMyFundraisers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    //find all fundraisers where createdBy matches the user's ID
    //sort by createdAt descending (newest first)
    const fundraisers = await Fundraiser.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json(fundraisers);
  } catch (error) {
    console.error('Error fetching user fundraisers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};












