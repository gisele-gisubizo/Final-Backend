import MenuItem from "../Models/BeverageItem.js"; // Ensure correct path
import cloudinary from "../utils/cloudinary.js";

// Get all beverage items
export const getAllBeverages = async (req, res) => {
    try {
        const beverages = await MenuItem.find({ category: "Beverages" });
        res.status(200).json({ success: true, beverages });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching beverages", error: error.message });
    }
};

// Get single beverage by ID
export const getBeverageById = async (req, res) => {
    try {
        const { id } = req.params;
        const beverage = await MenuItem.findOne({ _id: id, category: "Beverages" });

        if (!beverage) {
            return res.status(404).json({ success: false, message: "Beverage not found" });
        }

        res.status(200).json({ success: true, beverage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching beverage", error: error.message });
    }
};

// Add new beverage item
export const addBeverage = async (req, res) => {
    try {
        const { name, price } = req.body; // Category hardcoded as "Beverages"

        if (!name || !price || !req.file) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newBeverage = new MenuItem({ 
            name, 
            category: "Beverages", // Hardcoded to match beverage category
            price, 
            image: [result.secure_url] // Adjusted to array to match MenuItem schema
        });

        await newBeverage.save();

        res.status(201).json({ success: true, message: "Beverage added successfully", beverage: newBeverage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding beverage", error: error.message });
    }
};

// Update beverage item
export const updateBeverage = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBeverage = await MenuItem.findOneAndUpdate(
            { _id: id, category: "Beverages" }, // Ensure it’s a beverage
            { ...req.body, category: "Beverages" }, // Prevent category change
            { new: true }
        );

        if (!updatedBeverage) {
            return res.status(404).json({ success: false, message: "Beverage not found" });
        }

        res.status(200).json({ success: true, message: "Beverage updated successfully", beverage: updatedBeverage });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating beverage", error: error.message });
    }
};

// Delete beverage item
export const deleteBeverage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBeverage = await MenuItem.findOneAndDelete({ _id: id, category: "Beverages" });

        if (!deletedBeverage) {
            return res.status(404).json({ success: false, message: "Beverage not found" });
        }

        res.status(200).json({ success: true, message: "Beverage deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting beverage", error: error.message });
    }
};