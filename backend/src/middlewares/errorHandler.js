import { ApiError } from "../utils/apiError.js";

export const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json(new ApiError(400, "Validation Error", errors).toJSON());
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res
      .status(400)
      .json(new ApiError(400, `${field} already exists`).toJSON());
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json(new ApiError(401, "Invalid token").toJSON());
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json(new ApiError(401, "Token expired").toJSON());
  }

  console.error("Error:", err);

  res.status(500).json({
    success: false,
    statusCode: 500,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
};
