import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import {
  authenticateUser,
  createUser,
  generateToken,
  getUserByEmail,
  checkEligibility,
} from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, dateOfBirth, state } =
      req.body;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new ApiError(400, "User already exists with this email");
    }

    // Create new user
    const user = await createUser({
      firstName,
      lastName,
      email,
      phone,
      password,
      dateOfBirth,
      state,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json(
      new ApiResponse(201, "User registered successfully", {
        user,
        token,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Authenticate user
    const user = await authenticateUser(email, password);

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json(
      new ApiResponse(200, "Login successful", {
        user: user.toJSON(),
        token,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const checkVoterEligibility = async (req, res, next) => {
  try {
    const { dateOfBirth, state } = req.body;

    const eligibility = checkEligibility(dateOfBirth, state);

    res.json(new ApiResponse(200, "Eligibility check completed", eligibility));
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.json(new ApiResponse(200, "Profile fetched successfully", req.user));
  } catch (error) {
    next(error);
  }
};
