const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    // Guard: user may have been deleted after token was issued
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists. Please log in again.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// Only allow approved students (or admins)
const checkApproved = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }

  if (!req.user.isApproved) {
    return res.status(403).json({
      success: false,
      error: 'Your account is pending admin approval. Please wait for access to be granted.'
    });
  }

  next();
};

module.exports = { protect, authorize, checkApproved };
