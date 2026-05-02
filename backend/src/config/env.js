import dotenv from "dotenv";

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGODB_URI:
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/election-process-assistant",
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  BCRYPT_ROUNDS: 10,
};

export const validateConfig = () => {
  if (!config.OPENAI_API_KEY) {
    console.warn("⚠ Warning: OPENAI_API_KEY not set in environment variables");
  }
};
