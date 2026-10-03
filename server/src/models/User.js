import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxLength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'seller', 'admin'],
      default: 'customer',
    },
    avatar: {
      url: String,
      public_id: String,
    },
    refreshToken: {
      type: String,
      select: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare user password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_ACCESS_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    }
  );
};

// Generate JWT Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    }
  );
};

export const User = mongoose.model('User', userSchema);
