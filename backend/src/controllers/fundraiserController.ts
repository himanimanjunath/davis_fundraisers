//request = incoming http request and response = outgoing http response
import { Request, Response } from 'express';

//to edit documents in fundraiser collection in mongodb
import Fundraiser from '../models/Fundraiser.js';

//so backend knows which user is deleting / creating fundraisers 
import { AuthRequest } from '../middleware/auth.js'; 

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
  const id = req.params.id;
   const fund = await Fundraiser.findById(id);
  if (!fund) return res.status(404).json({ message: 'Not found' });

  //only person/acc who created the fundraiser can delete it
  //i wanna change this so it atuomatically deletes after the date for fundraiser has passed 
  if (fund.createdBy?.toString() !== req.userId) {
    return res.status(403).json({ message: 'Not authorized' });
  }

  //delete fundraiser from database & respond with success message 
  await Fundraiser.findByIdAndDelete(id);
  res.json( {message: 'Deleted'} );
}












