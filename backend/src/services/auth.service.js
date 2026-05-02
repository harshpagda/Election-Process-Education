import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY,
  });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired token");
  }
};

export const createUser = async (userData) => {
  const user = new User(userData);
  await user.save();
  return user.toJSON();
};

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ email }).select("+password");
};

export const authenticateUser = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await user.matchPassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  return user;
};

export const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const checkEligibility = async (dateOfBirth, state) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  const isEligible = age >= 18;
  return {
    isEligible,
    age,
    message: isEligible
      ? "You are eligible to vote"
      : `You will be eligible to vote in ${18 - age} years`,
  };
};
