import express from 'express';
import router from './MenuRoute.js';  // Ensure this import is correct

const DessertRouting = express.Router();

// Use '/MenuItem' route for Menu related actions
DessertRouting.use('/DessertItem', router);

export default DessertRouting;  
