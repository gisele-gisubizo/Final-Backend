import express from 'express';
import router from './HomeRoute.js';  // Ensure this import is correct

const IndexRouting = express.Router();

// Use '/MenuItem' route for Menu related actions
IndexRouting.use('/HomeItem', router);

export default IndexRouting;  
