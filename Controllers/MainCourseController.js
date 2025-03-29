import MainCourseItem from "../Models/MainCourseItem.js"; // Updated import path
import cloudinary from "../utils/cloudinary.js";

// Get all main course items
export const getAllMainCourses = async (req, res) => {
    try {
        const mainCourses = await MainCourseItem.find();
        res.status(200).json({ success: true, mainCourses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching main courses", error: error.message });
    }
};

// Get single main course by ID
export const getMainCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const mainCourse = await MainCourseItem.findById(id);

        if (!mainCourse) {
            return res.status(404).json({ success: false, message: "Main course not found" });
        }

        res.status(200).json({ success: true, mainCourse });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching main course", error: error.message });
    }
};

// Add new main course item
export const addMainCourse = async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || !price || !req.file) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newMainCourse = new MainCourseItem({ 
            name, 
            price, 
            image: [result.secure_url], // Changed to array to match new schema
        });

        await newMainCourse.save();

        res.status(201).json({ success: true, message: "Main course added successfully", mainCourse: newMainCourse });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding main course", error: error.message });
    }
};

// Update main course item
export const updateMainCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedMainCourse = await MainCourseItem.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        if (!updatedMainCourse) {
            return res.status(404).json({ success: false, message: "Main course not found" });
        }

        res.status(200).json({ success: true, message: "Main course updated successfully", mainCourse: updatedMainCourse });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating main course", error: error.message });
    }
};

// Delete main course item
export const deleteMainCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMainCourse = await MainCourseItem.findByIdAndDelete(id);

        if (!deletedMainCourse) {
            return res.status(404).json({ success: false, message: "Main course not found" });
        }

        res.status(200).json({ success: true, message: "Main course deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting main course", error: error.message });
    }
};