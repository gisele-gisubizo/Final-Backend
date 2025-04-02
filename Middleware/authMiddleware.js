import jwt from 'jsonwebtoken';
import User from '../Models/User.js'; // Ensure correct path

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); // Add this
    req.user = await User.findById(decoded.userId).select('-password');
    console.log('User from DB:', req.user); // Add this

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User belonging to this token no longer exists' });
    }

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    let message = 'Not authorized, token failed';
    if (error.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    }
    res.status(401).json({ success: false, message });
  }
};

export const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.userRole)) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};
