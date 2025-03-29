import HomeItem from "../Models/Home.js"; // Ensure correct path
import cloudinary from "../utils/cloudinary.js";

// Fetch all home items
export const getAllHomeItems = async (req, res) => {
    try {
        const homeItems = await HomeItem.find();
        res.status(200).json({ success: true, homeItems });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching home items", error: error.message });
    }
};

// Fetch home items by category
export const getHomeItemsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const homeItems = await HomeItem.find({ category });

        res.status(200).json({ success: true, homeItems });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching home items by category", error: error.message });
    }
};

// Add new home item
export const addHomeItem = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;

        if (!name || !category || !price || !description || !req.file) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Upload image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path);

        // Create a new home item with the description
        const newHomeItem = new HomeItem({
            name,
            category,
            price,
            image: result.secure_url,
            description,  // Include description here
        });

        await newHomeItem.save();

        res.status(201).json({ success: true, message: "Home item added successfully", homeItem: newHomeItem });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding home item", error: error.message });
    }
};

// Update existing home item
export const updateHomeItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, description } = req.body;

        // Prepare the update object
        const updateData = {
            name,
            category,
            price,
            description,  // Update description
        };

        // If image is provided, upload to cloudinary and update the image field
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            updateData.image = result.secure_url;
        }

        // Find and update the home item
        const updatedHomeItem = await HomeItem.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedHomeItem) {
            return res.status(404).json({ success: false, message: "Home item not found" });
        }

        res.status(200).json({ success: true, message: "Home item updated successfully", homeItem: updatedHomeItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating home item", error: error.message });
    }
};

// Delete home item
export const deleteHomeItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedHomeItem = await HomeItem.findByIdAndDelete(id);

        if (!deletedHomeItem) {
            return res.status(404).json({ success: false, message: "Home item not found" });
        }

        res.status(200).json({ success: true, message: "Home item deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting home item", error: error.message });
    }
};
