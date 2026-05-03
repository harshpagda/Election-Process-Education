import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "Token not provided");
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(401, "User not found");
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      ...user.toJSON(),
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json(error.toJSON());
    }
    return res
      .status(401)
      .json(new ApiError(401, "Invalid or expired token").toJSON());
  }
};

export const adminMiddleware = (req, res, next) => {
  try {
    if (req.user?.role !== "admin") {
      throw new ApiError(403, "Admin access required");
    }
    next();
  } catch (error) {
    return res
      .status(error.statusCode || 403)
      .json(
        (error instanceof ApiError
          ? error
          : new ApiError(403, error.message)
        ).toJSON(),
      );
  }
};

export default authMiddleware;
