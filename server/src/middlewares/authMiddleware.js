import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    throw new ApiError(401, 'Authentication token missing. Please log in.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(
        401,
        'User associated with this token no longer exists.'
      );
    }

    if (user.isBlocked) {
      throw new ApiError(403, 'User account is blocked.');
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired. Please refresh your token.');
    }
    throw new ApiError(401, 'Not authorized. Invalid token.');
  }
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Role '${req.user?.role || 'anonymous'}' is not allowed to access this resource`
        )
      );
    }
    next();
  };
};
