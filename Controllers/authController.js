import User from '../Models/User.js';
import jwt from 'jsonwebtoken';

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, tableNumber, role } = req.body;

        // Validation for required fields
        const missingFields = [];
        if (!firstName) missingFields.push('firstName');
        if (!lastName) missingFields.push('lastName');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        if (!confirmPassword) missingFields.push('confirmPassword');

        if (missingFields.length > 0) {
            return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Validate role
        const validRoles = ['customer', 'kitchen', 'admin'];
        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Create user with table number and role
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            tableNumber: tableNumber ? parseInt(tableNumber) : null,
            role: role || 'customer',
        });

        // Create token
        const token = createToken(user)

        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            tableNumber: user.tableNumber,
            role: user.role,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, tableNumber } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify table number if provided (since tableNumber is optional)
        if (tableNumber && user.tableNumber && user.tableNumber !== parseInt(tableNumber)) {
            return res.status(401).json({ message: 'Invalid table number' });
        }

        const token = createToken(user)

        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            tableNumber: user.tableNumber,
            role: user.role,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};