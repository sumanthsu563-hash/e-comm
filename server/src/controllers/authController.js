import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Prevent unauthorized creation of admin role via regular registration
  const userRole = role === 'admin' ? 'customer' : role || 'customer';

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
  });

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, cookieOptions);

  const createdUser = await User.findById(user._id);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: createdUser,
        accessToken,
      },
      'User registered successfully'
    )
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie('refreshToken', refreshToken, cookieOptions);

  const loggedInUser = await User.findById(user._id);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
      },
      'Logged in successfully'
    )
  );
});

export const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, 'Refresh token missing');
  }

  try {
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== incomingRefreshToken) {
      throw new ApiError(401, 'Refresh token is expired or invalid');
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res.cookie('refreshToken', newRefreshToken, cookieOptions);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: newAccessToken,
        },
        'Access token refreshed'
      )
    );
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { refreshToken: 1 },
    });
  }

  res.clearCookie('refreshToken', cookieOptions);

  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json(new ApiResponse(200, { user }, 'Profile retrieved'));
});
