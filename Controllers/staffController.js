import Staff from "../Models/Staff.js";

// Get all staff members
export const getAllStaff = async (req, res) => {
    try {
        const staff = await Staff.find();
        res.status(200).json({ success: true, staff });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching staff", error: error.message });
    }
};

// Get single staff by ID
export const getStaffById = async (req, res) => {
    try {
        const { id } = req.params;
        const staff = await Staff.findById(id);
        if (!staff) {
            return res.status(404).json({ success: false, message: "Staff member not found" });
        }
        res.status(200).json({ success: true, staff });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching staff member", error: error.message });
    }
};

// Add new staff member
export const addStaff = async (req, res) => {
    try {
        const { firstName, lastName, email, role, shift } = req.body;

        if (!firstName || !lastName || !email) {
            return res.status(400).json({ success: false, message: "First name, last name, and email are required" });
        }
        if (role === 'waiter' && !shift) {
            return res.status(400).json({ success: false, message: "Shift is required for waiters" });
        }

        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ success: false, message: "Staff member with this email already exists" });
        }

        const newStaff = new Staff({
            firstName,
            lastName,
            email,
            role: role || 'kitchen',
            ...(role === 'waiter' && { shift })
        });

        await newStaff.save();
        res.status(201).json({ success: true, message: "Staff member added successfully", staff: newStaff });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding staff member", error: error.message });
    }
};

// Update staff member
export const updateStaff = async (req, res) => {
    try {
        const { role, shift } = req.body;
        // If role is kitchen, ensure shift is unset
        const updateData = { ...req.body };
        if (role === 'kitchen') {
            updateData.shift = null;
        } else if (role === 'waiter' && !shift) {
            return res.status(400).json({ message: 'Shift is required for waiters' });
        }

        const staff = await Staff.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff not found' });
        }
        res.status(200).json({ success: true, staff });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete staff member
export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStaff = await Staff.findByIdAndDelete(id);
        if (!deletedStaff) {
            return res.status(404).json({ success: false, message: "Staff member not found" });
        }
        res.status(200).json({ success: true, message: "Staff member deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting staff member", error: error.message });
    }
};