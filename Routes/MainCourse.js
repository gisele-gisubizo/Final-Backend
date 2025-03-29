import express from "express";
import upload from "../Middleware/multer.js";
import { 
    getAllMainCourses, 
    getMainCourseById, 
    addMainCourse, 
    updateMainCourse, 
    deleteMainCourse 
} from "../Controllers/MainCourseController.js"; // Ensure path is correct

const router = express.Router(); 

// Get all main courses
router.get("/main-courses", getAllMainCourses);

// Get single main course by ID
router.get("/main-courses/:id", getMainCourseById);

// Add new main course with image upload
router.post("/main-courses/add", upload.single('image'), addMainCourse);

// Update main course by ID
router.put("/main-courses/:id", updateMainCourse);

// Delete main course by ID
router.delete("/main-courses/:id", deleteMainCourse);

export default router;