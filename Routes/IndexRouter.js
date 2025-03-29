import express from 'express';
import router from './MenuRoute.js';  // Ensure this import is correct

const indexRouter = express.Router();

// Use '/MenuItem' route for Menu related actions
indexRouter.use('/MenuItem', router);

export default indexRouter;  
