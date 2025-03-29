import express from 'express';
import router from './authRoutes.js';  // Ensure this import is correct

const authRouting = express.Router();

// Use '/MenuItem' route for Menu related actions
authRouting.use('/auth', router);

export default authRouting;  
