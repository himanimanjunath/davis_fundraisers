//creates, lists, deletes, gets one fundraiser
//for fundraiser related HTTP requests

import { Request, Response } from 'express';

//to edit documents in fundraiser collection in mongodb
import Fundraiser from '../models/Fundraiser.js';

//so backend knows which user is deleting / creating fundraisers 
import { AuthRequest } from '../middleware/auth.js';

//for POST requests to make new fundraisers by the logged-in user
//using authrequest because the route needs authentication 
export const createFundraiser = async (req:AuthRequest, res: Response) => {
  
  //pull out form data from request body 
  const { clubName, fundraiserName, location, dateTime, proceedsInfo, instagramLink, flyerImage } = req.body;

  if (!clubName || !fundraiserName || !location || !dateTime){
    return res.status(400).json({ message: 'clubName, fundraiserName, location and dateTime are required' })
  }

  //make new fundraiser doc using the model 
  try {
  const fund = new Fundraiser({
    clubName,
    fundraiserName,
    location,
    dateTime: new Date(dateTime), //covert dateTime into a real .js date obj
    proceedsInfo,
    instagramLink,
    flyerImage,
    createdBy: req.userId //to record which logged in user made it 
  });

  //save doc to mongodb
  await fund.save();

  //return http 201 created and send back saved fundraiser as JSON 
  res.status(201).json(fund);

  //500 internal server error if smthn goes wrong like mongodb failing 
  }catch (err){
  res.status(500).json({message: 'Error creating fundraiser', error: err});
  }
};


//handling get request to list the fundraisers 
//public route so no auth needed 
export const listFundraisers = async (req: Request, res: Response) => {
  
  //reading optional params from the URL 
  const {club, upcoming} = req.query;

  //empty filter obj to build our MongoDB query conditions 
  const filter: any = {};

  //filtering option so if we provide specific club it filters only that club's fundraisers
  if (club) filter.clubName = club;

  //for fundraisers happening in the future (greater than or equal to now)
  if (upcoming === 'true') filter.DateTime = {$gte: new Date()};

  //sort results by dateTime in descending order (-1 is newest first)
  //limit to 200 fundraisers max to prevent overloading 
  //send result back to frontend as JSON
  const funds = await Fundraiser.find(filter).sort({dateTime: -1}).limit(200).exec();
  res.json(funds);
}


export const getFundraiser = async (req: Request, res: Response) => {

  //get fundraiser ID from URL
  const id = req.params.id;
  
  //get fundraiser by ID in mongodb
  const fund = await Fundraiser.findById(id);
  if (!fund) return res.status(404).json({message: 'Not found'});
  res.json(fund);
}

export const deleteFundraiser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const fund = await Fundraiser.findById(id);
    if (!fund) {
      return res.status(404).json({ message: 'Not found' });
    }

    //only who created the fundraiser can delete it
    if (fund.createdBy?.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // delete from database
    await fund.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (error) {
    //console.error('Error deleting fundraiser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//get all fundraisers made by logged in user (for the dashboard view)
export const getMyFundraisers = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    //find all fundraisers where createdBy matches the user's ID
    //sort by createdAt descending (-1 = newest first)
    const fundraisers = await Fundraiser.find({ createdBy: userId })
      .sort({ createdAt: -1 })

    res.status(200).json(fundraisers);
    
  } catch (error) {
    //console.error('Error fetching user fundraisers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};












