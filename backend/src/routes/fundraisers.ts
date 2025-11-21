import express from 'express';
import { createFundraiser, listFundraisers, getFundraiser, deleteFundraiser } from '../controllers/fundraiserController.js';
import { authenticate } from '../middleware/auth.js'; 

//new express router instance just for fundraiser related endpoints 
const router = express.Router();

//GET endpoint at / and calls listFundraisers controller when someone sends request to api/fundraisers/
router.get('/', listFundraisers);

//:id means it matches any specific fundraiser ID 
//calls getFundraiser to fetch specific fundraiser from mongodb
router.get('/:id', getFundraiser);

// protected by authenticate 

//post endpoint at /
//runs authenticate before createFundraiser 
router.post('/', createFundraiser);

//delete endpoint at /:id
router.delete('/:id', deleteFundraiser);

//export to use in main server 
export default router;
