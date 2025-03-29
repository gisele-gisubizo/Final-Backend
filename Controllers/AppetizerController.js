import MenuItem from "../Models/AppetizerItem.js"; // Ensure correct path
import cloudinary from "../utils/cloudinary.js";

// Get all appetizer items
export const getAllAppetizers = async (req, res) => {
    try {
        const appetizers = await MenuItem.find({ category: "Appetizers" });
        res.status(200).json({ success: true, appetizers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching appetizers", error: error.message });
    }
};

// Get single appetizer by ID
export const getAppetizerById = async (req, res) => {
    try {
        const { id } = req.params;
        const appetizer = await MenuItem.findOne({ _id: id, category: "Appetizers" });

        if (!appetizer) {
            return res.status(404).json({ success: false, message: "Appetizer not found" });
        }

        res.status(200).json({ success: true, appetizer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching appetizer", error: error.message });
    }
};

// Add new appetizer item
export const addAppetizer = async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || !price || !req.file) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newAppetizer = new MenuItem({ 
            name, 
            category: "Appetizers", // Hardcoded category
            price, 
            image: [result.secure_url] // Adjusted to array to match MenuItem schema
        });

        await newAppetizer.save();

        res.status(201).json({ success: true, message: "Appetizer added successfully", appetizer: newAppetizer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding appetizer", error: error.message });
    }
};

// Update appetizer item
export const updateAppetizer = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAppetizer = await MenuItem.findOneAndUpdate(
            { _id: id, category: "Appetizers" },
            { ...req.body, category: "Appetizers" }, // Ensure category stays "Appetizers"
            { new: true }
        );

        if (!updatedAppetizer) {
            return res.status(404).json({ success: false, message: "Appetizer not found" });
        }

        res.status(200).json({ success: true, message: "Appetizer updated successfully", appetizer: updatedAppetizer });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating appetizer", error: error.message });
    }
};

// Delete appetizer item
export const deleteAppetizer = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAppetizer = await MenuItem.findOneAndDelete({ _id: id, category: "Appetizers" });

        if (!deletedAppetizer) {
            return res.status(404).json({ success: false, message: "Appetizer not found" });
        }

        res.status(200).json({ success: true, message: "Appetizer deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting appetizer", error: error.message });
    }
};