import express from "express";
import upload from "../Middleware/multer.js";
import { 
    getAllAppetizers, 
    getAppetizerById, 
    addAppetizer, 
    updateAppetizer, 
    deleteAppetizer 
} from "../Controllers/AppetizerController.js"; // Ensure path is correct

const router = express.Router(); 

// Get all appetizers
router.get("/appetizers", getAllAppetizers);

// Get single appetizer by ID
router.get("/appetizers/:id", getAppetizerById);

// Add new appetizer with image upload
router.post("/appetizers/add", upload.single('image'), addAppetizer);

// Update appetizer by ID
router.put("/appetizers/:id", updateAppetizer);

// Delete appetizer by ID
router.delete("/appetizers/:id", deleteAppetizer);

export default router;