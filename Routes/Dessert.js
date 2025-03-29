import express from "express";
import upload from "../Middleware/multer.js";
import { 
    getAllDesserts, 
    getDessertById, 
    addDessert, 
    updateDessert, 
    deleteDessert 
} from "../Controllers/DessertController.js"; // Ensure path is correct

const router = express.Router(); 

// Get all desserts
router.get("/desserts", getAllDesserts);

// Get single dessert by ID
router.get("/desserts/:id", getDessertById);

// Add new dessert with image upload
router.post("/desserts/add", upload.single('image'), addDessert);

// Update dessert by ID
router.put("/desserts/:id", updateDessert);

// Delete dessert by ID
router.delete("/desserts/:id", deleteDessert);

export default router;