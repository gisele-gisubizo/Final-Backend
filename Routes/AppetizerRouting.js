import express from 'express';
import router from './Appetizer.js';  // Ensure this import is correct

const AppetizerRouting = express.Router();

// Use '/MenuItem' route for Menu related actions
AppetizerRouting.use('/AppetizerItem', router);

export default AppetizerRouting;  
