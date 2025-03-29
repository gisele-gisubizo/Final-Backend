import MenuItem from "../Models/MenuItem.js"; // Ensure correct path
import cloudinary from "../utils/cloudinary.js";
export const getAllMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.status(200).json({ success: true, menuItems });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching menu items", error: error.message });
    }
};

export const getMenuItemsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const menuItems = await MenuItem.find({ category });

        res.status(200).json({ success: true, menuItems });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching menu items by category", error: error.message });
    }
};

export const addMenuItem = async (req, res) => {
    try {
        const { name, category, price } = req.body; // No need to destructure 'image' from req.body

        if (!name || !category || !price || !req.file) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const result = await cloudinary.uploader.upload(req.file.path); // Upload image first

        const newMenuItem = new MenuItem({ 
            name, 
            category, 
            price, 
            image: result.secure_url // Use the Cloudinary URL as the image
        });

        await newMenuItem.save();

        res.status(201).json({ success: true, message: "Menu item added successfully", menuItem: newMenuItem });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding menu item", error: error.message });
    }
};
export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMenuItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedMenuItem) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }

        res.status(200).json({ success: true, message: "Menu item updated successfully", menuItem: updatedMenuItem });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating menu item", error: error.message });
    }
};

export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMenuItem = await MenuItem.findByIdAndDelete(id);

        if (!deletedMenuItem) {
            return res.status(404).json({ success: false, message: "Menu item not found" });
        }

        res.status(200).json({ success: true, message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting menu item", error: error.message });
    }
};