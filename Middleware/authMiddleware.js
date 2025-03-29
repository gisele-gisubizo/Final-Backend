import jwt from 'jsonwebtoken';
import User from '../Models/User.js';

const protect = async (req, res, next) => {
  let token;

  // 1. Get token from header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token' 
    });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Get user and attach to request
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'User belonging to this token no longer exists' 
      });
    }

    // 4. Add user ID separately (optional)
    req.userId = decoded.userId;

    next();
  } catch (error) {
    // Handle specific JWT errors
    let message = 'Not authorized, token failed';
    if (error.name === 'TokenExpiredError') {
      message = 'Token expired';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Invalid token';
    }

    res.status(401).json({ 
      success: false,
      message 
    });
  }
};

export default protect;