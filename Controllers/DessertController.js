import MenuItem from "../Models/DessertItem.js.js"; // Ensure correct path
import cloudinary from "../utils/cloudinary.js";

// Get all dessert items
export const getAllDesserts = async (req, res) => {
    try {
        const desserts = await MenuItem.find({ category: "Desserts" });
        res.status(200).json({ success: true, desserts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching desserts", error: error.message });
    }
};

// Get single dessert by ID
export const getDessertById = async (req, res) => {
    try {
        const { id } = req.params;
        const dessert = await MenuItem.findOne({ _id: id, category: "Desserts" });

        if (!dessert) {
            return res.status(404).json({ success: false, message: "Dessert not found" });
        }

        res.status(200).json({ success: true, dessert });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching dessert", error: error.message });
    }
};

// Add new dessert item
export const addDessert = async (req, res) => {
    try {
        const { name, price } = req.body; // Category hardcoded as "Desserts"

        if (!name || !price || !req.file) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newDessert = new MenuItem({ 
            name, 
            category: "Desserts", // Hardcoded to match dessert category
            price, 
            image: [result.secure_url] // Adjusted to array to match MenuItem schema
        });

        await newDessert.save();

        res.status(201).json({ success: true, message: "Dessert added successfully", dessert: newDessert });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding dessert", error: error.message });
    }
};

// Update dessert item
export const updateDessert = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDessert = await MenuItem.findOneAndUpdate(
            { _id: id, category: "Desserts" }, // Ensure it’s a dessert
            { ...req.body, category: "Desserts" }, // Prevent category change
            { new: true }
        );

        if (!updatedDessert) {
            return res.status(404).json({ success: false, message: "Dessert not found" });
        }

        res.status(200).json({ success: true, message: "Dessert updated successfully", dessert: updatedDessert });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating dessert", error: error.message });
    }
};

// Delete dessert item
export const deleteDessert = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDessert = await MenuItem.findOneAndDelete({ _id: id, category: "Desserts" });

        if (!deletedDessert) {
            return res.status(404).json({ success: false, message: "Dessert not found" });
        }

        res.status(200).json({ success: true, message: "Dessert deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting dessert", error: error.message });
    }
};