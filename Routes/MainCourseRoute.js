import express from 'express';
import router from '../Routes/MainCourse.js';  // Ensure this import is correct

const MainCourseRouting = express.Router();

// Use '/MenuItem' route for Menu related actions
MainCourseRouting .use('/MainCourseItem', router);

export default MainCourseRouting ;  
